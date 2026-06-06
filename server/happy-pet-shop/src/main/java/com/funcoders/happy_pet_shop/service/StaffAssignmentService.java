package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.response.TicketResponse;
import com.funcoders.happy_pet_shop.entity.SupportTicket;
import com.funcoders.happy_pet_shop.entity.User;
import com.funcoders.happy_pet_shop.repository.StaffRepository;
import com.funcoders.happy_pet_shop.repository.SupportTicketRepository;
import com.funcoders.happy_pet_shop.repository.UserRepository;
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
    StaffRepository staffRepository;
    UserRepository userRepository;

    /**
     * Resolve staff ID: if it's a phone number (not UUID), look up the user by username/phone
     */
    public UUID resolveStaffId(String staffIdStr) {
        // Try to parse as UUID first
        try {
            return UUID.fromString(staffIdStr);
        } catch (IllegalArgumentException e) {
            // Not a UUID, treat as phone number / username
            log.info("staffId is not a UUID, looking up by username: {}", staffIdStr);
            User user = userRepository.findByUsername(staffIdStr)
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + staffIdStr));
            return user.getId();
        }
    }

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

        ticket.setStaff(staffRepository.getReferenceById(staffId));
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
        String customerName = "Khách vãng lai";
        if (ticket.getCustomer() != null
                && ticket.getCustomer().getUser() != null
                && ticket.getCustomer().getUser().getFirstName() != null) {
            customerName = ticket.getCustomer().getUser().getFirstName()
                    + " " + (ticket.getCustomer().getUser().getLastName() != null
                    ? ticket.getCustomer().getUser().getLastName() : "");
        }

        return TicketResponse.builder()
                .id(ticket.getId())
                .sessionId(ticket.getSessionId())
                .customerName(customerName.trim())
                .customerMessage(ticket.getCustomerMessage())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .category(ticket.getCategory())
                .createdAt(ticket.getCreatedAt())
                .build();
    }
}
