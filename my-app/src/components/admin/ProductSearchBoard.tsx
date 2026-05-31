"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductResponse } from "../../types/productTypes";

export function matchesProduct(p: ProductResponse, q: string) {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  const hay = [
    p.name,
    p.description,
    p.brand,
    p.categoryName,
    p.id,
    p.unit,
    p.origin,
    p.price != null ? String(p.price) : "",
    p.quantity != null ? String(p.quantity) : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(s);
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n);
}

type Props = {
  open: boolean;
  onClose: () => void;
  products: ProductResponse[];
  loading: boolean;
  onPick: (p: ProductResponse) => void;
  title?: string;
  headerClassName?: string;
};

export default function ProductSearchBoard({
  open,
  onClose,
  products,
  loading,
  onPick,
  title = "Find product",
  headerClassName = "bg-emerald-600",
}: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const filtered = useMemo(
    () => products.filter((p) => matchesProduct(p, query)),
    [products, query]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex">
      <style>{`
        @keyframes productBoardSlide {
          from { transform: translateX(100%); opacity: 0.9; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <button
        type="button"
        className="flex-1 bg-black/45 backdrop-blur-[2px]"
        aria-label="Close panel"
        onClick={onClose}
      />
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
        style={{ animation: "productBoardSlide 0.2s ease-out" }}
      >
        <div
          className={`px-4 py-3 border-b border-slate-200 flex items-center justify-between text-white ${headerClassName}`}
        >
          <h2 className="font-bold text-lg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/15 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-3 border-b border-slate-100 bg-white">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Search by name, brand, category, ID, price, stock…
          </label>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to filter…"
            className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2 bg-white">
          {loading ? (
            <p className="text-sm text-slate-500 p-4">Loading products…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate-500 p-4">No products match your search.</p>
          ) : (
            <ul className="space-y-1">
              {filtered.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onPick(p);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/60 transition-all"
                  >
                    <p className="font-semibold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{p.id}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-slate-600">
                      {p.brand && <span>Brand: {p.brand}</span>}
                      {p.categoryName && <span>Category: {p.categoryName}</span>}
                      {p.unit && <span>Unit: {p.unit}</span>}
                    </div>
                    <p className="text-sm font-medium text-emerald-700 mt-1">
                      {formatMoney(p.price ?? 0)} · Stock: {p.quantity ?? 0}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
