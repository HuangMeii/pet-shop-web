export interface ChatMessage {
  id?: string;
  sessionId: string;
  senderType: 'CUSTOMER' | 'STAFF' | 'SYSTEM';
  content: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
  customerId?: string;
  imageUrl?: string;
}

export interface ChatResponse {
  sessionId: string;
  senderType: 'CUSTOMER' | 'STAFF' | 'SYSTEM';
  content: string;
  imageUrl?: string;
  timestamp: string;
}
