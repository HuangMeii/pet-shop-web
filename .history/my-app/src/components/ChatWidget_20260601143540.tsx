import { useState, useRef, useEffect, useCallback } from "react";
import { chatService } from "../services/chatService";
import type { ChatMessage } from "../types/chatTypes";

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

const WELCOME_MESSAGE: ChatMessage = {
  sessionId: "",
  senderType: "AI",
  content:
    "👋 Xin chào! Tôi là trợ lý ảo của HappyPetShop. Tôi có thể giúp gì cho bạn? Hãy hỏi tôi về sản phẩm, dịch vụ, hoặc bất kỳ thắc mắc nào!",
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when chat opens
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, scrollToBottom]);

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

      const botMessage: ChatMessage = {
        sessionId: response.sessionId,
        senderType: response.senderType,
        content: response.content,
      };
      setMessages((prev) => [...prev, botMessage]);

      // If handoff required, show system message
      if (response.handoffRequired) {
        const systemMessage: ChatMessage = {
          sessionId: response.sessionId,
          senderType: "SYSTEM",
          content:
            "🔄 Đã chuyển sang nhân viên hỗ trợ. Vui lòng đợi trong giây lát...",
        };
        setMessages((prev) => [...prev, systemMessage]);
      }
    } catch {
      const errorMessage: ChatMessage = {
        sessionId,
        senderType: "SYSTEM",
        content:
          "❌ Rất tiếc, đã xảy ra lỗi kết nối. Vui lòng thử lại sau.",
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
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-fab"
        aria-label="Chat với HappyPetShop"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(79, 70, 229, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          zIndex: 9999,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 25px rgba(79, 70, 229, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(79, 70, 229, 0.4)";
        }}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div
          className="chat-box"
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            width: "360px",
            height: "520px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9998,
            overflow: "hidden",
            animation: "slideUp 0.3s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              backgroundColor: "#4f46e5",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "24px" }}>🤖</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "15px" }}>
                HappyPet Bot
              </div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>
                Trợ lý ảo • Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              backgroundColor: "#f8fafc",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.senderType === "CUSTOMER" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  alignSelf:
                    msg.senderType === "CUSTOMER"
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius:
