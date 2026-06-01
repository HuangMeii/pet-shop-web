package com.funcoders.happy_pet_shop.repository;

import com.funcoders.happy_pet_shop.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, UUID> {

    List<SupportTicket> findByStatus(String status);

    List<SupportTicket> findByStaffId(UUID staffId);

    Optional<SupportTicket> findBySessionId(String sessionId);

    List<SupportTicket> findByStatusOrderByCreatedAtDesc(String status);

    long countByStatus(String status);
}
