import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { getInvoiceById } from "../../../services/invoiceService";
import type { InvoiceResponse } from "../../../types/invoiceTypes";

export function useInvoiceDetail(invoiceId: string | undefined) {
  const { user, isAuthenticated } = useAuth();
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!invoiceId) {
      setInvoice(null);
      setError("Thiếu mã hóa đơn");
      setLoading(false);
      return;
    }
    if (!user?.id) {
      setInvoice(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getInvoiceById(invoiceId);
      if (data.customerId !== user.id) {
        setInvoice(null);
        setError("Bạn không có quyền xem hóa đơn này.");
        return;
      }
      setInvoice(data);
    } catch (e) {
      setInvoice(null);
      setError(e instanceof Error ? e.message : "Không tải được hóa đơn");
    } finally {
      setLoading(false);
    }
  }, [invoiceId, user?.id]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setInvoice(null);
      setLoading(false);
      setError(null);
      return;
    }
    void load();
  }, [isAuthenticated, user?.id, load]);

  return {
    invoice,
    loading,
    error,
    refetch: load,
    isAuthenticated,
    customerId: user?.id,
  };
}
