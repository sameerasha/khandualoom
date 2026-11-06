package com.khandualoom.microservice.product.service;

import com.khandualoom.microservice.product.model.Product;
import com.khandualoom.microservice.product.model.RecentView;
import com.khandualoom.microservice.product.repository.ProductRepository;
import com.khandualoom.microservice.product.repository.ProductSpecifications;
import com.khandualoom.microservice.product.repository.RecentViewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductCatalogService {

    private final ProductRepository productRepository;
    private final RecentViewRepository recentViewRepository;
    private final ProductMetricsService productMetricsService;

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        log.info("Fetching all products from DB");
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Product> getProductsPaged(
            int page, int size, String category, String badge, String weave, String fabric, Double minRating, String sort
    ) {
        String[] sortParams = sort.split(",");
        String sortBy = sortParams[0];
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Specification<Product> spec = ProductSpecifications.withFilters(category, badge, weave, fabric, minRating);

        long start = System.currentTimeMillis();
        productMetricsService.recordProductSearch(category);
        Page<Product> result = productRepository.findAll(spec, pageable);
        productMetricsService.recordCatalogQueryDuration(System.currentTimeMillis() - start);
        return result;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "products_categories", sync = true)
    public List<String> getCategories() {
        return productRepository.findDistinctCategories();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "product_by_id", key = "#id", sync = true)
    public Optional<Product> getProductById(Long id) {
        productMetricsService.recordProductView();
        return productRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Product> getRelatedProducts(Long id) {
        return productRepository.findById(id).map(product -> {
            Pageable limit = PageRequest.of(0, 4);
            return productRepository.findRelatedProducts(
                    product.getId(),
                    product.getCategory(),
                    product.getColor(),
                    product.getFabric(),
                    product.getWeave(),
                    limit
            ).getContent();
        }).orElse(List.of());
    }

    @Transactional
    public void trackProductView(Long productId, Long userId) {
        productRepository.findById(productId).ifPresent(product -> {
            RecentView view = recentViewRepository.findFirstByUserIdAndProductId(userId, productId)
                    .orElseGet(() -> RecentView.builder()
                            .userId(userId)
                            .product(product)
                            .build());

            view.setViewedAt(LocalDateTime.now());
            recentViewRepository.save(view);

            List<RecentView> allViews = recentViewRepository.findByUserIdOrderByViewedAtDesc(userId, PageRequest.of(0, 50));
            if (allViews.size() > 10) {
                recentViewRepository.deleteAll(allViews.subList(10, allViews.size()));
            }
        });
    }

    @Transactional(readOnly = true)
    public List<Product> getRecentViews(Long userId) {
        Pageable topTen = PageRequest.of(0, 10);
        return recentViewRepository.findByUserIdOrderByViewedAtDesc(userId, topTen).stream()
                .map(RecentView::getProduct)
                .filter(p -> p != null)
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = {"products_all", "products_categories", "product_by_id"}, allEntries = true)
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    @CacheEvict(value = {"products_all", "products_categories", "product_by_id"}, allEntries = true)
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
