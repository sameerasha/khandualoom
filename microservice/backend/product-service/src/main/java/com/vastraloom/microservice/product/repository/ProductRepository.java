package com.vastraloom.microservice.product.repository;

import com.vastraloom.microservice.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findDistinctCategories();

    Page<Product> findByCategory(String category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.id != :id AND (p.category = :category OR p.color = :color OR p.fabric = :fabric OR p.weave = :weave)")
    Page<Product> findRelatedProducts(@org.springframework.data.repository.query.Param("id") Long id,
                                      @org.springframework.data.repository.query.Param("category") String category,
                                      @org.springframework.data.repository.query.Param("color") String color,
                                      @org.springframework.data.repository.query.Param("fabric") String fabric,
                                      @org.springframework.data.repository.query.Param("weave") String weave,
                                      Pageable pageable);
}

