package com.khandualoom.microservice.inventory.domain.repository;

import com.khandualoom.microservice.inventory.domain.model.InventoryItem;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository {
    InventoryItem save(InventoryItem item);
    Optional<InventoryItem> findByProductId(Long productId);
    List<InventoryItem> findAll();
    List<InventoryItem> findByProductIdIn(List<Long> productIds);
}
