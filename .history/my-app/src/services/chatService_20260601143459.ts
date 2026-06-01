import { API_CONFIG } from "../config/apiConfig";
import { ChatRequest, ChatResponse } from "../types/chatTypes";

const BASE_URL = API_CONFIG.BASE_URL;

export const chatService = {
  /**
   * Send a message to the AI chatbot
   */
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await fetch(
      `${BASE_URL}${API_CONFIG.ENDPOINTS.CHAT.SEND_MESSAGE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get chat history for a session
   */
  getHistory: async (sessionId: string): Promise<ChatResponse[]> => {
    const response = await fetch(
      `${BASE_URL}${API_CONFIG.ENDPOINTS.CHAT.GET_HISTORY(sessionId)}`
    );

    if (!response.ok) {
      throw new Error(`Chat history API error: ${response.status}`);
    }

    return response.json();
  },
};
