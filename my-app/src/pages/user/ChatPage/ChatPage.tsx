import { useState, useRef, useEffect, useCallback } from "react";
import { chatService } from "../../../services/chatService";
import type { ChatMessage } from "../../../types/chatTypes";
import { Client } from "@stomp/stompjs";
import { API_CONFIG } from "../../../config/apiConfig";

// Generate a simple UUID v4
const generateSessionId = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const SESSION_KEY = "chat_session_id";

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hasStaff, setHasStaff] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stompClientRef = useRef<Client | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [messages, scrollToBottom]);

  // Connect to WebSocket for receiving staff messages
  useEffect(() => {
    const sessionId = getSessionId();
    const wsBaseUrl = API_CONFIG.BASE_URL.replace(/^http/, "ws");

    const client = new Client({
      brokerURL: `${wsBaseUrl}/ws/chat`,
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        // Subscribe to receive messages from staff
        client.subscribe(`/queue/chat/${sessionId}`, (message: { body: string }) => {
          const payload = JSON.parse(message.body);
          const staffMsg: ChatMessage = {
            sessionId,
            senderType: "STAFF",
            content: payload.content,
            createdAt: payload.timestamp,
          };
          setMessages((prev) => [...prev, staffMsg]);
          setHasStaff(true);
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: () => {
        setIsConnected(false);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  // Load chat history when mounting
  useEffect(() => {
    const sessionId = getSessionId();
    chatService
      .getHistory(sessionId)
      .then((history) => {
        if (history && history.length > 0) {
          setMessages(history);
          // Check if there's any staff message in history
          const hasStaffMsg = history.some((msg) => msg.senderType === "STAFF");
          setHasStaff(hasStaffMsg);
        }
      })
      .catch(() => {
        // Silently fail
      });
  }, []);

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const sessionId = getSessionId();

    // Add user message
    const userMessage: ChatMessage = {
      sessionId,
      senderType: "CUSTOMER",
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        sessionId,
        message: text,
      });

      // Show system response (confirmation that message was sent to staff)
      const systemMessage: ChatMessage = {
        sessionId: response.sessionId,
        senderType: "SYSTEM",
        content: response.content,
      };
      setMessages((prev) => [...prev, systemMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        sessionId,
        senderType: "SYSTEM",
        content: "❌ Rất tiếc, đã xảy ra lỗi kết nối. Vui lòng thử lại sau.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
            🎧
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Hỗ trợ trực tuyến</h1>
            <p className="text-sm text-white/80">
              {isConnected
                ? "🟢 Đã kết nối - Nhân viên sẽ phản hồi sớm nhất"
                : "🔴 Đang kết nối lại..."}
            </p>
          </div>
          {hasStaff && (
            <span className="px-3 py-1 bg-green-400/20 text-green-100 text-xs rounded-full font-medium">
              🟢 Đang hỗ trợ
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg font-medium text-gray-500">
                Bạn cần hỗ trợ gì?
              </p>
              <p className="text-sm mt-2 text-center max-w-sm">
                Hãy gửi yêu cầu hỗ trợ, nhân viên của HappyPetShop sẽ phản hồi
                bạn trong thời gian sớm nhất!
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderType === "CUSTOMER" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] ${
                  msg.senderType === "CUSTOMER"
                    ? "bg-indigo-600 text-white rounded-2xl rounded-br-md"
                    : msg.senderType === "SYSTEM"
                    ? "bg-amber-50 text-amber-800 rounded-2xl rounded-bl-md border border-amber-200"
                    : "bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100"
                } px-4 py-3`}
              >
                {msg.senderType === "STAFF" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-sm">🧑‍💼</span>
                    <span className="text-xs font-semibold text-indigo-600">
                      Nhân viên hỗ trợ
                    </span>
                  </div>
                )}
                {msg.senderType === "SYSTEM" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs font-semibold text-amber-600">
                      📋 Hệ thống
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
                {msg.createdAt && (
                  <p
                    className={`text-xs mt-1.5 ${
                      msg.senderType === "CUSTOMER"
                        ? "text-indigo-200"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100 px-4 py-3">
                <div className="flex gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: "0s" }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              disabled={isLoading}
              className="flex-1 px-5 py-3 bg-gray-100 border border-gray-200 rounded-full outline-none text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium text-sm flex items-center gap-2"
            >
              Gửi
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {hasStaff
              ? "💬 Bạn đang trò chuyện với nhân viên hỗ trợ"
              : "⏳ Yêu cầu của bạn sẽ được chuyển đến nhân viên hỗ trợ"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
