package com.vastraloom.api.controller;

import com.vastraloom.api.model.Product;
import com.vastraloom.api.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import com.vastraloom.api.repository.ProductSpecifications;
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // GET /api/products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // GET /api/products/paged
    @GetMapping("/paged")
    public Page<Product> getProductsPaged(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "8") int size,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "badge", required = false) String badge,
            @RequestParam(name = "weave", required = false) String weave,
            @RequestParam(name = "fabric", required = false) String fabric,
            @RequestParam(name = "minRating", required = false) Double minRating,
            @RequestParam(name = "sort", defaultValue = "id,desc") String sort) {
            
        String[] sortParams = sort.split(",");
        String sortBy = sortParams[0];
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Specification<Product> spec = ProductSpecifications.withFilters(category, badge, weave, fabric, minRating);
        
        return productRepository.findAll(spec, pageable);
    }

    // GET /api/products/categories
    @GetMapping("/categories")
    public List<String> getCategories() {
        return productRepository.findDistinctCategories();
    }

    // GET /api/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@NonNull @PathVariable("id") Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/products/{id}/related
    @GetMapping("/{id}/related")
    public ResponseEntity<List<Product>> getRelatedProducts(@NonNull @PathVariable("id") Long id) {
        return productRepository.findById(id).map(product -> {
            Pageable limit = PageRequest.of(0, 4);
            Page<Product> relatedPage = productRepository.findRelatedProducts(
                    product.getId(),
                    product.getCategory(),
                    product.getColor(),
                    product.getFabric(),
                    product.getWeave(),
                    limit
            );
            return ResponseEntity.ok(relatedPage.getContent());
        }).orElse(ResponseEntity.notFound().build());
    }
}
