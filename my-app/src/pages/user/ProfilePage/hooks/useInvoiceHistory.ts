import { useState, useMemo } from "react";

export type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

export interface Invoice {
  id: string;
  date: string;
  status: "Paid" | "Pending" | "Cancelled";
  totalAmount: number;
  items: number;
}

export const useInvoiceHistory = (invoices: Invoice[], itemsPerPage: number = 5) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const sortedInvoices = useMemo(() => {
    const sorted = [...invoices];
    switch (sortBy) {
      case "date-desc": return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "date-asc": return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "amount-desc": return sorted.sort((a, b) => b.totalAmount - a.totalAmount);
      case "amount-asc": return sorted.sort((a, b) => a.totalAmount - b.totalAmount);
      default: return sorted;
    }
  }, [invoices, sortBy]);

  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = sortedInvoices.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    currentPage,
    totalPages,
    currentInvoices,
    sortBy,
    setSortBy,
    goToPage,
    startIndex,
    totalCount: invoices.length
  };
};