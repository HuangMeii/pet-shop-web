type StatusKey = "paid" | "pending" | "cancelled" | "failed" | "refunded" | "other";

const normalizeKey = (status: string): StatusKey => {
  const u = (status ?? "").toUpperCase();
  if (u === "PAID") return "paid";
  if (u === "PENDING") return "pending";
  if (u === "CANCELLED") return "cancelled";
  if (u === "FAILED") return "failed";
  if (u === "REFUNDED") return "refunded";
  const title = (status ?? "").replace(/_/g, " ");
  const t = title.toLowerCase();
  if (t === "paid") return "paid";
  if (t === "pending") return "pending";
  if (t === "cancelled") return "cancelled";
  if (t === "failed") return "failed";
  if (t === "refunded") return "refunded";
  return "other";
};

const StatusBadge = ({ status }: { status: string }) => {
  const key = normalizeKey(status);
  const styles: Record<StatusKey, string> = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-orange-100 text-orange-800",
    cancelled: "bg-red-100 text-red-800",
    failed: "bg-amber-100 text-amber-900",
    refunded: "bg-violet-100 text-violet-800",
    other: "bg-gray-100 text-gray-800",
  };

  const labels: Record<Exclude<StatusKey, "other">, string> = {
    paid: "✓ Đã thanh toán",
    pending: "⏳ Chờ thanh toán",
    cancelled: "✕ Đã hủy",
    failed: "⚠ Thanh toán thất bại",
    refunded: "↩ Đã hoàn tiền",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[key]}`}>
      {key === "other" ? status : labels[key]}
    </span>
  );
};

export default StatusBadge;