package com.vastraloom.api.controller;

import com.vastraloom.api.model.Product;
import com.vastraloom.api.model.RecentView;
import com.vastraloom.api.repository.ProductRepository;
import com.vastraloom.api.repository.RecentViewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import com.vastraloom.api.repository.ProductSpecifications;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/products")
@Slf4j
@SuppressWarnings("null")
public class ProductController {

    private final ProductRepository productRepository;
    private final RecentViewRepository recentViewRepository;

    public ProductController(ProductRepository productRepository, RecentViewRepository recentViewRepository) {
        this.productRepository = productRepository;
        this.recentViewRepository = recentViewRepository;
    }

    // GET /api/products
    // GET /api/products
    @GetMapping
    public List<Product> getAllProducts() {
        log.info("Fetching all products");
        return productRepository.findAll();
    }

    // GET /api/products/paged
    @GetMapping("/paged")
    public Page<Product> getProductsPaged(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "9") int size,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "badge", required = false) String badge,
            @RequestParam(name = "weave", required = false) String weave,
            @RequestParam(name = "fabric", required = false) String fabric,
            @RequestParam(name = "minRating", required = false) Double minRating,
            @RequestParam(name = "sort", defaultValue = "id,desc") String sort) {

        String[] sortParams = sort.split(",");
        String sortBy = sortParams[0];
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Specification<Product> spec = ProductSpecifications.withFilters(category, badge, weave, fabric, minRating);

        log.info("Fetching paged products: page={}, size={}, category={}, sort={}", page, size, category, sort);
        return productRepository.findAll(spec, pageable);
    }

    // GET /api/products/categories
    @GetMapping("/categories")
    public List<String> getCategories() {
        log.info("Fetching all distinct product categories");
        return productRepository.findDistinctCategories();
    }

    // GET /api/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@NonNull @PathVariable("id") Long id) {
        log.info("Fetching product by ID: {}", id);
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Product with ID {} not found", id);
                    return ResponseEntity.notFound().build();
                });
    }

    // GET /api/products/{id}/related
    @GetMapping("/{id}/related")
    public ResponseEntity<List<Product>> getRelatedProducts(@NonNull @PathVariable("id") Long id) {
        log.info("Fetching related products for product ID: {}", id);
        return productRepository.findById(id).map(product -> {
            Pageable limit = PageRequest.of(0, 4);
            Page<Product> relatedPage = productRepository.findRelatedProducts(
                    product.getId(),
                    product.getCategory(),
                    product.getColor(),
                    product.getFabric(),
                    product.getWeave(),
                    limit);
            return ResponseEntity.ok(relatedPage.getContent());
        }).orElseGet(() -> {
            log.warn("Cannot fetch related products; Product with ID {} not found", id);
            return ResponseEntity.notFound().build();
        });
    }

    // POST /api/products/{id}/view
    @PostMapping("/{id}/view")
    public ResponseEntity<?> trackProductView(
            @PathVariable("id") Long id,
            @RequestParam(name = "userId", required = true) Long userId) {
        
        if (userId == null) {
            return ResponseEntity.badRequest().body("userId must be provided.");
        }

        return productRepository.findById(id).map(product -> {
            RecentView recentView = recentViewRepository.findFirstByUserIdAndProductId(userId, id).orElse(null);

            if (recentView == null) {
                recentView = RecentView.builder()
                        .userId(userId)
                        .product(product)
                        .viewedAt(LocalDateTime.now())
                        .build();
            } else {
                recentView.setViewedAt(LocalDateTime.now());
            }
            recentViewRepository.save(recentView);
            
            // Keep only the 10 most recent views
            List<RecentView> allViews = recentViewRepository.findByUserIdOrderByViewedAtDesc(userId, PageRequest.of(0, 50));
            if (allViews.size() > 10) {
                recentViewRepository.deleteAll(allViews.subList(10, allViews.size()));
            }
            
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // GET /api/products/recent
    @GetMapping("/recent")
    public ResponseEntity<List<Product>> getRecentViews(
            @RequestParam(name = "userId", required = true) Long userId) {
        
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        Pageable topTen = PageRequest.of(0, 10);
        List<RecentView> views = recentViewRepository.findByUserIdOrderByViewedAtDesc(userId, topTen);

        List<Product> products = views.stream()
                .map(RecentView::getProduct)
                .filter(p -> p != null)
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(products);
    }
}
