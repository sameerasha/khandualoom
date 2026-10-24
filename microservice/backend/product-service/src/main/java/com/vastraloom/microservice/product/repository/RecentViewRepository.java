package com.vastraloom.microservice.product.repository;

import com.vastraloom.microservice.product.model.RecentView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecentViewRepository extends JpaRepository<RecentView, Long> {
    
    Optional<RecentView> findFirstByUserIdAndProductId(Long userId, Long productId);
    
    @Query("SELECT r FROM RecentView r WHERE r.userId = :userId ORDER BY r.viewedAt DESC")
    List<RecentView> findByUserIdOrderByViewedAtDesc(@Param("userId") Long userId, Pageable pageable);

    @org.springframework.transaction.annotation.Transactional
    void deleteByUserId(Long userId);
}

