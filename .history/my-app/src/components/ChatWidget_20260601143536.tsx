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
