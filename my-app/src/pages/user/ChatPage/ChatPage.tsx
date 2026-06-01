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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
            imageUrl: payload.imageUrl || undefined,
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh không được quá 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if ((!text && !selectedImage) || isLoading) return;

    const sessionId = getSessionId();

    // Add user message
    const userMessage: ChatMessage = {
      sessionId,
      senderType: "CUSTOMER",
      content: text || (selectedImage ? "[Hình ảnh]" : ""),
      imageUrl: selectedImage || undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        sessionId,
        message: text || (selectedImage ? "[Hình ảnh]" : ""),
        imageUrl: selectedImage || undefined,
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
                {msg.imageUrl && (
                  <div className="mb-2">
                    <img
                      src={msg.imageUrl}
                      alt="Hình ảnh đính kèm"
                      className="max-w-full rounded-lg max-h-48 object-cover cursor-pointer"
                      onClick={() => window.open(msg.imageUrl, "_blank")}
                    />
                  </div>
                )}
                {msg.content && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                )}
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

        {/* Image Preview */}
        {selectedImage && (
          <div className="px-6 py-2 bg-gray-50 border-t border-gray-100">
            <div className="relative inline-block">
              <img
                src={selectedImage}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="px-3 py-3 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 disabled:opacity-50 transition flex items-center justify-center"
              title="Đính kèm ảnh"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
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
              disabled={(!inputText.trim() && !selectedImage) || isLoading}
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
