package com.khandualoom.microservice.inventory.infrastructure.persistence.repository;

import com.khandualoom.microservice.inventory.infrastructure.persistence.entity.InventoryItemJpaEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpringDataInventoryRepository extends JpaRepository<InventoryItemJpaEntity, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM InventoryItemJpaEntity i WHERE i.productId = :productId")
    Optional<InventoryItemJpaEntity> findByProductIdWithLock(@Param("productId") Long productId);

    Optional<InventoryItemJpaEntity> findByProductId(Long productId);

    List<InventoryItemJpaEntity> findByProductIdIn(List<Long> productIds);

    @Modifying
    @Query("UPDATE InventoryItemJpaEntity i SET i.availableStock = i.availableStock - :quantity, i.reservedStock = i.reservedStock + :quantity, i.version = i.version + 1 WHERE i.productId = :productId AND i.availableStock >= :quantity")
    int atomicReserveStock(@Param("productId") Long productId, @Param("quantity") int quantity);

    @Modifying
    @Query("UPDATE InventoryItemJpaEntity i SET i.availableStock = i.availableStock + :quantity, i.reservedStock = i.reservedStock - :quantity, i.version = i.version + 1 WHERE i.productId = :productId AND i.reservedStock >= :quantity")
    int atomicReleaseStock(@Param("productId") Long productId, @Param("quantity") int quantity);

    @Modifying
    @Query("UPDATE InventoryItemJpaEntity i SET i.totalStock = i.totalStock - :quantity, i.reservedStock = i.reservedStock - :quantity, i.version = i.version + 1 WHERE i.productId = :productId AND i.reservedStock >= :quantity")
    int atomicFulfillStock(@Param("productId") Long productId, @Param("quantity") int quantity);
}
