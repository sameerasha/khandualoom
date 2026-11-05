package com.khandualoom.microservice.product.controller;

import com.khandualoom.microservice.product.model.Product;
import com.khandualoom.microservice.product.service.ProductCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductCatalogService catalogService;

    @PostMapping
    public ResponseEntity<Product> createProduct(@NonNull @RequestBody Product product) {
        Product savedProduct = catalogService.saveProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@NonNull @PathVariable("id") Long id, @NonNull @RequestBody Product productDetails) {
        return catalogService.getProductById(id)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setCategory(productDetails.getCategory());
                    product.setPrice(productDetails.getPrice());
                    product.setOriginalPrice(productDetails.getOriginalPrice());
                    if (productDetails.getImage() != null) {
                        product.setImage(productDetails.getImage());
                    }
                    product.setDescription(productDetails.getDescription());
                    product.setFabric(productDetails.getFabric());
                    product.setWeave(productDetails.getWeave());
                    product.setColor(productDetails.getColor());
                    if (productDetails.getBadge() != null) {
                        product.setBadge(productDetails.getBadge());
                    }
                    if (productDetails.getImages() != null) {
                        product.setImages(productDetails.getImages());
                    }
                    Product updated = catalogService.saveProduct(product);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@NonNull @PathVariable("id") Long id) {
        return catalogService.getProductById(id)
                .map(product -> {
                    catalogService.deleteProduct(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
