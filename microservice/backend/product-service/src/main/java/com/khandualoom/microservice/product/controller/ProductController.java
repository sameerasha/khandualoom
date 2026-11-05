package com.khandualoom.microservice.product.controller;

import com.khandualoom.microservice.product.model.Product;
import com.khandualoom.microservice.product.service.ProductCatalogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Slf4j
@RequiredArgsConstructor
public class ProductController {

    private final ProductCatalogService catalogService;

    @GetMapping
    public List<Product> getAllProducts() {
        log.info("Fetching all products");
        return catalogService.getAllProducts();
    }

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

        return catalogService.getProductsPaged(page, size, category, badge, weave, fabric, minRating, sort);
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        log.info("Fetching all distinct product categories");
        return catalogService.getCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@NonNull @PathVariable("id") Long id) {
        log.info("Fetching product by ID: {}", id);
        return catalogService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Product with ID {} not found", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<Product>> getRelatedProducts(@NonNull @PathVariable("id") Long id) {
        log.info("Fetching related products for product ID: {}", id);
        List<Product> related = catalogService.getRelatedProducts(id);
        if (related.isEmpty() && catalogService.getProductById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(related);
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> trackProductView(
            @PathVariable("id") Long id,
            @RequestParam(name = "userId", required = true) Long userId) {

        if (userId == null) {
            return ResponseEntity.badRequest().body("userId must be provided.");
        }

        if (catalogService.getProductById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        catalogService.trackProductView(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Product>> getRecentViews(
            @RequestParam(name = "userId", required = true) Long userId) {

        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(catalogService.getRecentViews(userId));
    }
}
