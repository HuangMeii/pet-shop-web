import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import { API_CONFIG } from "../../../config/apiConfig";
import { chatService } from "../../../services/chatService";
import type { ChatMessage } from "../../../types/chatTypes";

interface Ticket {
  id: string;
  sessionId: string;
  customerName: string;
  customerMessage: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
}

const ChatManagementPage: React.FC = () => {
  const [pendingTickets, setPendingTickets] = useState<Ticket[]>([]);
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [staffId, setStaffId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load staff ID from localStorage or auth context
  useEffect(() => {
    const storedStaffId = localStorage.getItem("staffId");
    if (storedStaffId) {
      setStaffId(storedStaffId);
    }
  }, []);

  const loadPendingTickets = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/staff/chat/tickets/pending`
      );
      if (response.ok) {
        const data = await response.json();
        setPendingTickets(data);
      }
    } catch (err) {
      console.error("Failed to load pending tickets:", err);
    }
  }, []);

  const loadActiveTickets = useCallback(async () => {
    if (!staffId) return;
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/staff/chat/tickets/my/${staffId}`
      );
      if (response.ok) {
        const data = await response.json();
        setActiveTickets(data);
      }
    } catch (err) {
      console.error("Failed to load active tickets:", err);
    }
  }, [staffId]);

  // Connect to WebSocket for receiving new ticket notifications
  useEffect(() => {
    const wsBaseUrl = API_CONFIG.BASE_URL.replace(/^http/, "ws");
    const client = new Client({
      brokerURL: `${wsBaseUrl}/ws/chat`,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Staff WebSocket connected");
        // Listen for new chat requests
        client.subscribe("/topic/staff/chat-requests", () => {
          // Refresh pending tickets when new request comes in
          loadPendingTickets();
        });
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [loadPendingTickets]);

  // Subscribe to selected ticket's session for real-time messages
  useEffect(() => {
    if (!selectedTicket || !stompClientRef.current?.connected) return;

    const client = stompClientRef.current;
    const sessionId = selectedTicket.sessionId;

    const subscription = client.subscribe(
      `/queue/chat/${sessionId}`,
      (message: { body: string }) => {
        const payload = JSON.parse(message.body);
        const newMsg: ChatMessage = {
          sessionId,
          senderType: payload.senderType || "CUSTOMER",
          content: payload.content,
          createdAt: payload.timestamp,
        };
        setMessages((prev) => [...prev, newMsg]);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedTicket]);

  // Load messages when selecting a ticket
  useEffect(() => {
    if (selectedTicket) {
      chatService
        .getHistory(selectedTicket.sessionId)
        .then((history) => {
          if (history) {
            setMessages(history);
          }
        })
        .catch(() => {
          setMessages([]);
        });
    } else {
      setMessages([]);
    }
  }, [selectedTicket]);

  // Initial load
  useEffect(() => {
    loadPendingTickets();
  }, [loadPendingTickets]);

  useEffect(() => {
    if (staffId) {
      loadActiveTickets();
    }
  }, [staffId, loadActiveTickets]);

  const handleAcceptTicket = async (ticketId: string) => {
    if (!staffId) {
      alert("Vui lòng đăng nhập với tài khoản nhân viên");
      return;
    }
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/staff/chat/tickets/${ticketId}/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ staffId }),
        }
      );
      if (response.ok) {
        loadPendingTickets();
        loadActiveTickets();
      }
    } catch (err) {
      console.error("Failed to accept ticket:", err);
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/staff/chat/tickets/${ticketId}/close`,
        { method: "POST" }
      );
      if (response.ok) {
        loadActiveTickets();
        setSelectedTicket(null);
      }
    } catch (err) {
      console.error("Failed to close ticket:", err);
    }
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || !selectedTicket || !staffId) return;

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/staff/chat/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: selectedTicket.sessionId,
            message: text,
            staffId,
          }),
        }
      );
      if (response.ok) {
        // Add staff message to local state immediately
        const staffMsg: ChatMessage = {
          sessionId: selectedTicket.sessionId,
          senderType: "STAFF",
          content: text,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, staffMsg]);
        setInputText("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-2rem)]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        💬 Quản lý hỗ trợ trực tuyến
      </h1>

      <div className="flex gap-6 h-[calc(100%-4rem)]">
        {/* Left Panel - Ticket List */}
        <div className="w-96 flex flex-col gap-4 overflow-y-auto">
          {/* Pending Tickets */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Yêu cầu chờ xử lý ({pendingTickets.length})
            </h2>
            {pendingTickets.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Không có yêu cầu mới
              </p>
            ) : (
              <div className="space-y-2">
                {pendingTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      selectedTicket?.id === ticket.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-gray-800">
                          {ticket.customerName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {ticket.customerMessage}
                        </p>
                      </div>
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        {new Date(ticket.createdAt).toLocaleTimeString("vi-VN")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptTicket(ticket.id);
                        }}
                        className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition"
                      >
                        Nhận hỗ trợ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Tickets */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Đang hỗ trợ ({activeTickets.length})
            </h2>
            {activeTickets.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Chưa có ticket nào được nhận
              </p>
            ) : (
              <div className="space-y-2">
                {activeTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      selectedTicket?.id === ticket.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-gray-800">
                          {ticket.customerName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {ticket.customerMessage}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseTicket(ticket.id);
                        }}
                        className="text-xs text-red-600 hover:text-red-800 transition"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedTicket.customerName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Session: {selectedTicket.sessionId.slice(0, 8)}...
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedTicket.status === "ACTIVE" && (
                    <button
                      onClick={() => handleCloseTicket(selectedTicket.id)}
                      className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Đóng ticket
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-10">
                    Chưa có tin nhắn nào
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.senderType === "STAFF"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.senderType === "STAFF"
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : msg.senderType === "SYSTEM"
                            ? "bg-yellow-100 text-yellow-800 rounded-bl-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                        }`}
                      >
                        {msg.senderType === "CUSTOMER" && (
                          <p className="text-xs font-semibold text-indigo-600 mb-1">
                            👤 Khách hàng
                          </p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString(
                                "vi-VN"
                              )
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white rounded-b-lg">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn trả lời..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg">Chọn một yêu cầu hỗ trợ để bắt đầu</p>
                <p className="text-sm mt-2">
                  Các yêu cầu mới sẽ xuất hiện ở cột bên trái
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatManagementPage;
