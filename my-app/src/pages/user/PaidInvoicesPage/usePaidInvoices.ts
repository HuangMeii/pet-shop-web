import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { getInvoicesByCustomerId } from "../../../services/invoiceService";
import type { InvoiceResponse } from "../../../types/invoiceTypes";

// const isPaidStatus = (status: string | undefined) =>
//   (status ?? "").toUpperCase() === "PAID";

export function usePaidInvoices() {
  const { user, isAuthenticated } = useAuth();
  const [paidInvoices, setPaidInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaid = useCallback(async () => {
    if (!user?.id) {
      setPaidInvoices([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await getInvoicesByCustomerId(user.id);
      // setPaidInvoices(list.filter((inv) => isPaidStatus(inv.status)));
      setPaidInvoices(list);
      console.log(paidInvoices);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được hóa đơn");
      setPaidInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setPaidInvoices([]);
      setLoading(false);
      return;
    }
    void fetchPaid();
  }, [isAuthenticated, user?.id, fetchPaid]);

  return {
    paidInvoices,
    loading,
    error,
    refetch: fetchPaid,
    isAuthenticated,
  };
}
