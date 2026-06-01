export interface ChatMessage {
  id?: string;
  sessionId: string;
  senderType: 'CUSTOMER' | 'AI' | 'STAFF' | 'SYSTEM';
  content: string;
  createdAt?: string;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
  customerId?: string;
}

export interface ChatResponse {
  sessionId: string;
  senderType: 'AI' | 'STAFF' | 'SYSTEM';
  content: string;
  handoffRequired: boolean;
  timestamp: string;
}
