package com.vastraloom.api.repository;

import com.vastraloom.api.model.Product;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecifications {

    public static Specification<Product> withFilters(String category, String badge, String weave, String fabric, Double minRating) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null && !category.equalsIgnoreCase("All") && !category.isEmpty()) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (badge != null && !badge.equalsIgnoreCase("All") && !badge.isEmpty()) {
                predicates.add(cb.equal(root.get("badge"), badge));
            }

            if (weave != null && !weave.equalsIgnoreCase("All") && !weave.isEmpty()) {
                predicates.add(cb.equal(root.get("weave"), weave));
            }

            if (fabric != null && !fabric.equalsIgnoreCase("All") && !fabric.isEmpty()) {
                predicates.add(cb.equal(root.get("fabric"), fabric));
            }

            if (minRating != null && minRating > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
