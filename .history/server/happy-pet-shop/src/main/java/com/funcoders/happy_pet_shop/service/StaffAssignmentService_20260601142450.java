package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.response.TicketResponse;
import com.funcoders.happy_pet_shop.entity.SupportTicket;
import com.funcoders.happy_pet_shop.repository.SupportTicketRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class StaffAssignmentService {

    SupportTicketRepository supportTicketRepository;

    /**
     * Get all pending tickets
     */
    public List<TicketResponse> getPendingTickets() {
        return supportTicketRepository.findByStatusOrderByCreatedAtDesc("PENDING")
                .stream()
                .map(this::toTicketResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get tickets assigned to a specific staff
     */
    public List<TicketResponse> getStaffTickets(UUID staffId) {
        return supportTicketRepository.findByStaffId(staffId)
                .stream()
                .map(this::toTicketResponse)
                .collect(Collectors.toList());
    }

    /**
     * Staff accepts a ticket
     */
    @Transactional
    public TicketResponse acceptTicket(UUID ticketId, UUID staffId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        ticket.setStaff(new com.funcoders.happy_pet_shop.entity.Staff(staffId));
        ticket.setStatus("ACTIVE");
        ticket.setAssignedAt(LocalDateTime.now());
        ticket = supportTicketRepository.save(ticket);

        log.info("Staff {} accepted ticket {}", staffId, ticketId);
        return toTicketResponse(ticket);
    }

    /**
     * Close a ticket
     */
    @Transactional
    public TicketResponse closeTicket(UUID ticketId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        ticket.setStatus("CLOSED");
        ticket.setClosedAt(LocalDateTime.now());
        ticket = supportTicketRepository.save(ticket);

        log.info("Ticket {} closed", ticketId);
        return toTicketResponse(ticket);
    }

    private TicketResponse toTicketResponse(SupportTicket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .sessionId(ticket.getSessionId())
                .customerName(ticket.getCustomer() != null ? ticket.getCustomer().getName() : "Khách vãng lai")
                .customerMessage(ticket.getCustomerMessage())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .category(ticket.getCategory())
                .createdAt(ticket.getCreatedAt())
                .build();
    }
}
