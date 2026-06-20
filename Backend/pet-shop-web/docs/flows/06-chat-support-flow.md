# Luồng 6: Chat hỗ trợ (Chat Support)

## 1. Tổng quan

Luồng chat hỗ trợ cho phép khách hàng gửi yêu cầu tư vấn và trò chuyện real-time với nhân viên qua WebSocket. Hệ thống sử dụng STOMP protocol để giao tiếp real-time và hỗ trợ gửi tin nhắn văn bản cũng như hình ảnh.

## 2. Actors / Vai trò

| Vai trò | Mô tả |
|---------|-------|
| **USER** | Khách hàng - gửi tin nhắn, nhận phản hồi từ nhân viên |
| **STAFF** | Nhân viên - nhận thông báo yêu cầu mới, trả lời khách hàng |

## 3. Kiến trúc WebSocket

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              STOMP Client (sockjs-client)             │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend (Spring Boot)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              WebSocketConfig                          │   │
│  │  - /ws/chat endpoint (SockJS + raw)                   │   │
│  │  - /topic broker (staff notifications)                │   │
│  │  - /queue broker (customer messages)                  │   │
│  │  - /app prefix (client → server)                      │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                          │                                   │
│  ┌──────────────────────┴───────────────────────────────┐   │
│  │              ChatService                              │   │
│  │  - processMessage()                                   │   │
│  │  - staffSendMessage()                                 │   │
│  │  - getHistory()                                       │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                          │                                   │
│  ┌──────────────────────┴───────────────────────────────┐   │
│  │              StaffAssignmentService                   │   │
│  │  - getPendingTickets()                                │   │
│  │  - acceptTicket()                                     │   │
│  │  - closeTicket()                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 4. Luồng xử lý chi tiết

### 4.1. Khách hàng gửi tin nhắn

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- WebSocket Connect ---->|                                |
   |   /ws/chat                |                                |
   |                           |                                |
   |--- STOMP SUBSCRIBE ------>|                                |
   |   /queue/chat/{sessionId} |                                |
   |                           |                                |
   |--- STOMP SEND ----------->|                                |
   |   /app/chat.send          |                                |
   |   {sessionId, message,    |                                |
   |    customerId, imageUrl}  |                                |
   |                           |                                |
   |                           |--- 1. Check image moderation ->|
   |                           |    (nếu có imageUrl)           |
   |                           |                                |
   |                           |--- 2. Save ChatMessage ------->|
   |                           |    senderType: "CUSTOMER"      |
   |                           |                                |
   |                           |--- 3. Create SupportTicket --->|
   |                           |    status: "PENDING"           |
   |                           |    priority: "NORMAL"          |
   |                           |                                |
   |                           |--- 4. Notify staff via WS ---->|
   |                           |    /topic/staff/chat-requests  |
   |                           |    {ticketId, sessionId,       |
   |                           |     customerMessage, timestamp}|
   |                           |                                |
   |<-- ChatResponse ----------|                                |
   |   "Đã gửi yêu cầu tư vấn" |                                |
```

**Backend:**
- **Controller:** `ChatController.java`
- **Service:** `ChatService.java`
- **Method:** `processMessage(sessionId, message, customerId, imageUrl)`

#### Xử lý chi tiết:

**Bước 1: Kiểm duyệt hình ảnh**
```java
if (imageUrl != null && !imageUrl.isEmpty()) {
    moderationService.checkImages(Collections.singletonList(imageUrl));
}
```

**Bước 2: Lưu tin nhắn khách hàng**
```java
ChatMessage customerMsg = ChatMessage.builder()
    .sessionId(sessionId)
    .senderType("CUSTOMER")
    .content(message != null ? message : "")
    .imageUrl(imageUrl)
    .build();
chatMessageRepository.save(customerMsg);
```

**Bước 3: Tạo SupportTicket**
```java
SupportTicket ticket = SupportTicket.builder()
    .sessionId(sessionId)
    .customerMessage(customerMessage)
    .status("PENDING")
    .priority("NORMAL")
    .build();
if (customerId != null) {
    ticket.setCustomer(customerRepository.getReferenceById(UUID.fromString(customerId)));
}
ticket = supportTicketRepository.save(ticket);
```

**Bước 4: Thông báo cho Staff qua WebSocket**
```java
Map<String, Object> payload = Map.of(
    "ticketId", ticket.getId().toString(),
    "sessionId", sessionId,
    "customerMessage", customerMessage,
    "timestamp", LocalDateTime.now().toString()
);
messagingTemplate.convertAndSend("/topic/staff/chat-requests", (Object) payload);
```

### 4.2. Nhân viên nhận và xử lý yêu cầu

```
[Staff Client]              [Server]                         [Database]
   |                           |                                |
   |--- GET /api/staff/chat -->|                                |
   |   /tickets/pending        |                                |
   |                           |--- Find PENDING tickets ----->|
   |                           |<-- List<TicketResponse> -------|
   |<-- Danh sách ticket ------|                                |
   |                           |                                |
   |--- PUT /api/staff/chat -->|                                |
   |   /tickets/{id}/accept    |                                |
   |   {staffId}               |                                |
   |                           |--- Update ticket ------------->|
   |                           |    status: "ACTIVE"            |
   |                           |    staff: staffId              |
   |                           |    assignedAt: now             |
   |<-- TicketResponse --------|                                |
```

**Backend:**
- **Controller:** `StaffChatController.java`
- **Service:** `StaffAssignmentService.java`
- **Methods:**
  - `getPendingTickets()` - Lấy tất cả ticket PENDING
  - `acceptTicket(ticketId, staffId)` - Nhận ticket
  - `closeTicket(ticketId)` - Đóng ticket

### 4.3. Nhân viên trả lời khách hàng

```
[Staff Client]              [Server]                    [Customer Client]
   |                           |                             |
   |--- POST /api/staff/chat->|                             |
   |   /send/{sessionId}      |                             |
   |   {message, imageUrl}    |                             |
   |                           |                             |
   |                           |--- 1. Check image mod ---->|
   |                           |                             |
   |                           |--- 2. Save ChatMessage --->|
   |                           |    senderType: "STAFF"      |
   |                           |                             |
   |                           |--- 3. Send via WebSocket -->|
   |                           |    /queue/chat/{sessionId}  |
   |                           |    {senderType, content,    |
   |                           |     imageUrl, timestamp}    |
   |                           |                             |
   |<-- ChatResponse ----------|                             |
```

**Backend:**
- **Service:** `ChatService.java`
- **Method:** `staffSendMessage(sessionId, message, staffId, imageUrl)`

```java
ChatMessage staffMsg = ChatMessage.builder()
    .sessionId(sessionId)
    .senderType("STAFF")
    .content(message != null ? message : "")
    .imageUrl(imageUrl)
    .build();
chatMessageRepository.save(staffMsg);

// Gửi đến customer qua WebSocket
Map<String, Object> staffPayload = Map.of(
    "senderType", "STAFF",
    "content", message != null ? message : "",
    "imageUrl", imageUrl != null ? imageUrl : "",
    "timestamp", LocalDateTime.now().toString()
);
messagingTemplate.convertAndSend("/queue/chat/" + sessionId, (Object) staffPayload);
```

### 4.4. Xem lịch sử chat

```
[Client]                    [Server]                         [Database]
   |                           |                                |
   |--- GET /api/chat -------->|                                |
   |   /history/{sessionId}    |                                |
   |                           |--- Find by sessionId -------->|
   |                           |<-- List<ChatMessage> ----------|
   |<-- ChatMessage[] ---------|                                |
```

## 5. Cấu trúc dữ liệu

### ChatMessage Entity
```
ChatMessage {
    id: UUID (PK)
    sessionId: String
    senderType: String (CUSTOMER, STAFF, SYSTEM)
    content: String (Text)
    imageUrl: String (nullable)
    createdAt: LocalDateTime
}
```

### SupportTicket Entity
```
SupportTicket {
    id: UUID (PK)
    sessionId: String
    customer: Customer (N-1, nullable)
    staff: Staff (N-1, nullable)
    customerMessage: String
    status: String (PENDING, ACTIVE, CLOSED)
    priority: String (NORMAL, HIGH, URGENT)
    category: String (nullable)
    assignedAt: LocalDateTime
    closedAt: LocalDateTime
    createdAt: LocalDateTime
}
```

## 6. WebSocket Configuration

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/chat")
                .setAllowedOriginPatterns("*")
                .withSockJS();
        registry.addEndpoint("/ws/chat")
                .setAllowedOriginPatterns("*");
    }
}
```

## 7. API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/chat/history/{sessionId}` | Lấy lịch sử chat | USER/STAFF |
| GET | `/api/staff/chat/tickets/pending` | Lấy ticket đang chờ | STAFF |
| GET | `/api/staff/chat/tickets/staff/{staffId}` | Lấy ticket của staff | STAFF |
| PUT | `/api/staff/chat/tickets/{id}/accept` | Nhận ticket | STAFF |
| PUT | `/api/staff/chat/tickets/{id}/close` | Đóng ticket | STAFF |
| POST | `/api/staff/chat/send/{sessionId}` | Staff gửi tin nhắn | STAFF |

## 8. WebSocket Topics

| Topic | Direction | Mô tả |
|-------|-----------|-------|
| `/queue/chat/{sessionId}` | Server → Customer | Tin nhắn từ staff đến customer |
| `/topic/staff/chat-requests` | Server → Staff | Thông báo yêu cầu chat mới |
| `/app/chat.send` | Customer → Server | Customer gửi tin nhắn |

## 9. Frontend Components

| Component | Mô tả |
|-----------|-------|
| `ChatPage.tsx` | Trang chat của khách hàng |
| `ChatManagementPage.tsx` | Trang quản lý chat của nhân viên |
| `chatService.ts` | Service gọi API chat |
| `chatTypes.ts` | TypeScript types cho chat |
