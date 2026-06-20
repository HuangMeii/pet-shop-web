package com.funcoders.happy_pet_shop.repository;

import com.funcoders.happy_pet_shop.entity.PromotionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface PromotionDetailRepository extends JpaRepository<PromotionDetail, UUID> {
    @Query("""
            select pd from PromotionDetail pd
            join fetch pd.promotion p
            join fetch pd.product pr
            where p.status = 'ACTIVE'
            and (p.startDate is null or p.startDate <= :now)
            and (p.endDate is null or p.endDate >= :now)
            and pr.id in :productIds
            """)
    List<PromotionDetail> findActivePromotionDetails(
            Set<UUID> productIds,
            LocalDate now
    );
}
