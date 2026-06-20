import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPaymentStatus } from "../../../services/paymentService";

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "cancelled" | "error">("loading");
  const [message, setMessage] = useState("Đang kiểm tra trạng thái thanh toán...");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // PayOS trả về các query params: orderCode, status, id, cancel, ...
        const orderCode = searchParams.get("orderCode");
        const cancel = searchParams.get("cancel");
        const statusParam = searchParams.get("status");

        console.log("Payment result params:", Object.fromEntries(searchParams.entries()));

        if (cancel === "true" || statusParam === "CANCELLED") {
          setStatus("cancelled");
          setMessage("Bạn đã hủy thanh toán. Đơn hàng chưa được tạo.");
          return;
        }

        if (statusParam === "PAID") {
          setStatus("success");
          setMessage("✅ Thanh toán thành công! Vui lòng quay lại quầy để nhận hóa đơn.");
          return;
        }

        // Nếu có orderCode, kiểm tra thêm từ backend
        if (orderCode) {
          const result = await getPaymentStatus(orderCode);
          const payStatus = result?.status || "";

          if (payStatus === "PAID") {
            setStatus("success");
            setMessage("✅ Thanh toán thành công! Vui lòng quay lại quầy để nhận hóa đơn.");
          } else if (payStatus === "CANCELLED") {
            setStatus("cancelled");
            setMessage("Bạn đã hủy thanh toán. Đơn hàng chưa được tạo.");
          } else {
            setStatus("loading");
            setMessage(`Trạng thái: ${payStatus}. Vui lòng đợi trong giây lát...`);
          }
        } else {
          setStatus("error");
          setMessage("Không có thông tin thanh toán. Vui lòng liên hệ nhân viên quầy.");
        }
      } catch (error) {
        console.error("Payment status check error:", error);
        setStatus("error");
        setMessage("Không thể kiểm tra trạng thái thanh toán. Vui lòng liên hệ nhân viên quầy.");
      }
    };

    // Delay một chút để PayOS kịp redirect
    const timer = setTimeout(checkStatus, 1000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const getEmoji = () => {
    switch (status) {
      case "loading": return "⏳";
      case "success": return "✅";
      case "cancelled": return "ℹ️";
      case "error": return "❌";
    }
  };

  const getTitle = () => {
    switch (status) {
      case "loading": return "Đang xử lý...";
      case "success": return "Thanh toán thành công!";
      case "cancelled": return "Đã hủy thanh toán";
      case "error": return "Có lỗi xảy ra";
    }
  };

  const getBgColor = () => {
    switch (status) {
      case "success": return "#d4edda";
      case "cancelled": return "#fff3cd";
      case "error": return "#f8d7da";
      default: return "#e2e3e5";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "40px 48px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: 480,
          width: "90%",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>{getEmoji()}</div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#333",
            marginBottom: 12,
          }}
        >
          {getTitle()}
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#555",
            lineHeight: 1.6,
            marginBottom: 24,
            padding: 16,
            background: getBgColor(),
            borderRadius: 8,
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/user/products")}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              background: "#f97316",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            🛍️ Tiếp tục mua sắm
          </button>
          {status === "cancelled" && (
            <button
              onClick={() => window.close()}
              style={{
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 600,
                color: "#333",
                background: "#e5e7eb",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              🔙 Đóng tab này
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;
