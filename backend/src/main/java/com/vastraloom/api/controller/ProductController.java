package com.vastraloom.api.controller;

import com.vastraloom.api.model.Product;
import com.vastraloom.api.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // GET /api/products/categories
    @GetMapping("/categories")
    public List<String> getCategories() {
        return productRepository.findDistinctCategories();
    }

    // GET /api/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@NonNull @PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/products (Requires ROLE_ADMIN)
    @PostMapping
    public ResponseEntity<Product> createProduct(@NonNull @RequestBody Product product) {
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    // PUT /api/products/{id} (Requires ROLE_ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@NonNull @PathVariable Long id, @NonNull @RequestBody Product productDetails) {
        return productRepository.findById(id)
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
                    Product updated = productRepository.save(product);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/products/{id} (Requires ROLE_ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@NonNull @PathVariable Long id) {
        return productRepository.findById(id)
                .map((@NonNull Product product) -> {
                    productRepository.delete(product);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
