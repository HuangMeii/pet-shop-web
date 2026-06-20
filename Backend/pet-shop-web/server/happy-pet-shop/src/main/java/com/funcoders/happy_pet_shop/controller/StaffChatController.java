package com.funcoders.happy_pet_shop.controller;

import com.funcoders.happy_pet_shop.dto.response.ChatResponse;
import com.funcoders.happy_pet_shop.dto.response.TicketResponse;
import com.funcoders.happy_pet_shop.service.ChatService;
import com.funcoders.happy_pet_shop.service.StaffAssignmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/staff/chat")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffChatController {

    ChatService chatService;
    StaffAssignmentService staffAssignmentService;

    /**
     * Get all pending support tickets
     */
    @GetMapping("/tickets/pending")
    public ResponseEntity<List<TicketResponse>> getPendingTickets() {
        return ResponseEntity.ok(staffAssignmentService.getPendingTickets());
    }

    /**
     * Get tickets assigned to a specific staff (supports UUID or phone number)
     */
    @GetMapping("/tickets/my/{staffId}")
    public ResponseEntity<List<TicketResponse>> getMyTickets(@PathVariable String staffId) {
        UUID resolvedId = staffAssignmentService.resolveStaffId(staffId);
        return ResponseEntity.ok(staffAssignmentService.getStaffTickets(resolvedId));
    }

    /**
     * Staff accepts a ticket (supports UUID or phone number)
     */
    @PostMapping("/tickets/{ticketId}/accept")
    public ResponseEntity<TicketResponse> acceptTicket(
            @PathVariable UUID ticketId,
            @RequestBody Map<String, String> body) {
        UUID resolvedId = staffAssignmentService.resolveStaffId(body.get("staffId"));
        return ResponseEntity.ok(staffAssignmentService.acceptTicket(ticketId, resolvedId));
    }

    /**
     * Close a ticket
     */
    @PostMapping("/tickets/{ticketId}/close")
    public ResponseEntity<TicketResponse> closeTicket(@PathVariable UUID ticketId) {
        return ResponseEntity.ok(staffAssignmentService.closeTicket(ticketId));
    }

    /**
     * Staff sends a message to a customer session (supports UUID or phone number)
     */
    @PostMapping("/send")
    public ResponseEntity<ChatResponse> staffSendMessage(@RequestBody Map<String, String> body) {
        UUID resolvedId = staffAssignmentService.resolveStaffId(body.get("staffId"));
        return ResponseEntity.ok(chatService.staffSendMessage(
                body.get("sessionId"),
                body.get("message"),
                resolvedId,
                body.get("imageUrl")
        ));
    }
}
