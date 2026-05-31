/** Mirrors `com.funcoders.happy_pet_shop.constant.PaymentStatus` for UI copy. */
export const PAYMENT_STATUS_ENTRIES = [
  {
    code: "PENDING",
    title: "Chờ thanh toán",
    description: "Đơn vừa được tạo, chưa ghi nhận thanh toán.",
  },
  {
    code: "PAID",
    title: "Đã thanh toán",
    description: "Thanh toán đã được xác nhận.",
  },
  {
    code: "CANCELLED",
    title: "Đã hủy",
    description: "Đơn bị hủy bởi khách hoặc hệ thống.",
  },
  {
    code: "FAILED",
    title: "Thanh toán thất bại",
    description: "Giao dịch không thành công.",
  },
  {
    code: "REFUNDED",
    title: "Đã hoàn tiền",
    description: "Số tiền đã được hoàn lại cho khách.",
  },
] as const;

export function normalizePaymentStatus(status: string | undefined): string {
  return (status ?? "").trim().toUpperCase();
}
