package com.khandualoom.microservice.inventory.infrastructure.persistence.adapter;

import com.khandualoom.microservice.inventory.domain.model.InventoryItem;
import com.khandualoom.microservice.inventory.domain.repository.InventoryRepository;
import com.khandualoom.microservice.inventory.infrastructure.persistence.entity.InventoryItemJpaEntity;
import com.khandualoom.microservice.inventory.infrastructure.persistence.repository.SpringDataInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class InventoryPersistenceAdapter implements InventoryRepository {

    private final SpringDataInventoryRepository repository;

    @Override
    public InventoryItem save(InventoryItem domain) {
        InventoryItemJpaEntity entity = toEntity(domain);
        InventoryItemJpaEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<InventoryItem> findByProductId(Long productId) {
        return repository.findByProductIdWithLock(productId).map(this::toDomain);
    }

    @Override
    public List<InventoryItem> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public List<InventoryItem> findByProductIdIn(List<Long> productIds) {
        return repository.findByProductIdIn(productIds).stream().map(this::toDomain).toList();
    }

    private InventoryItem toDomain(InventoryItemJpaEntity entity) {
        return InventoryItem.builder()
                .id(entity.getId())
                .productId(entity.getProductId())
                .availableStock(entity.getAvailableStock())
                .reservedStock(entity.getReservedStock())
                .totalStock(entity.getTotalStock())
                .reorderThreshold(entity.getReorderThreshold())
                .version(entity.getVersion())
                .createdDate(entity.getCreatedDate())
                .modifiedDate(entity.getModifiedDate())
                .build();
    }

    private InventoryItemJpaEntity toEntity(InventoryItem domain) {
        return InventoryItemJpaEntity.builder()
                .id(domain.getId())
                .productId(domain.getProductId())
                .availableStock(domain.getAvailableStock())
                .reservedStock(domain.getReservedStock())
                .totalStock(domain.getTotalStock())
                .reorderThreshold(domain.getReorderThreshold())
                .version(domain.getVersion() != null ? domain.getVersion() : 0L)
                .createdDate(domain.getCreatedDate())
                .modifiedDate(domain.getModifiedDate())
                .build();
    }
}
