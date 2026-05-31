"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPurchase } from "../../../services/purchaseService";
import { getAllStaff } from "../../../services/staffService";
import { getAllSuppliers } from "../../../services/supplierService";
import { getAllProducts } from "../../../services/productService";
import type { PurchaseDetailCreationRequest } from "../../../types/purchaseTypes";
import type { StaffResponse } from "../../../types/staffTypes";
import type { SupplierResponse } from "../../../types/supplierTypes";
import type { ProductResponse } from "../../../types/productTypes";
import ProductSearchBoard from "../../../components/admin/ProductSearchBoard";

type LineDraft = {
  productId: string;
  quantity: string;
  unitPrice: string;
};

function staffLabel(s: StaffResponse): string {
  const u = s.user;
  if (!u) return s.id;
  const name = [u.lastName, u.firstName].filter(Boolean).join(" ").trim();
  return name || u.username || s.id;
}

function emptyLine(): LineDraft {
  return { productId: "", quantity: "1", unitPrice: "" };
}

function productLabel(p: ProductResponse) {
  return p.name || p.id;
}

function matchesSupplier(sup: SupplierResponse, q: string) {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  const hay = [sup.name, sup.email, sup.phone, sup.address, sup.id, sup.status]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(s);
}

function SupplierSearchBoard({
  open,
  onClose,
  suppliers,
  loading,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  suppliers: SupplierResponse[];
  loading: boolean;
  onPick: (s: SupplierResponse) => void;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const filtered = useMemo(
    () => suppliers.filter((s) => matchesSupplier(s, query)),
    [suppliers, query]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex">
      <button
        type="button"
        className="flex-1 bg-black/45 backdrop-blur-[2px]"
        aria-label="Close panel"
        onClick={onClose}
      />
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-[slideFromRight_0.2s_ease-out]">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-emerald-600 text-white">
          <h2 className="font-bold text-lg">Find supplier</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/15 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-3 border-b border-slate-100">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Search by name, phone, email, address, ID…
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
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <p className="text-sm text-slate-500 p-4">Loading suppliers…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate-500 p-4">No suppliers match your search.</p>
          ) : (
            <ul className="space-y-1">
              {filtered.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onPick(s);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/60 transition-all"
                  >
                    <p className="font-semibold text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{s.id}</p>
                    {s.phone && <p className="text-sm text-slate-600 mt-1">📞 {s.phone}</p>}
                    {s.email && <p className="text-sm text-slate-600">{s.email}</p>}
                    {s.address && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.address}</p>
                    )}
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

export default function AddPurchasePage() {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState<StaffResponse[]>([]);
  const [supplierList, setSupplierList] = useState<SupplierResponse[]>([]);
  const [productList, setProductList] = useState<ProductResponse[]>([]);
  const [refsLoading, setRefsLoading] = useState(true);
  const [staffId, setStaffId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([emptyLine()]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [supplierBoardOpen, setSupplierBoardOpen] = useState(false);
  const [productLineForPicker, setProductLineForPicker] = useState<number | null>(null);

  const loadRefs = useCallback(async () => {
    setRefsLoading(true);
    setFormError(null);
    try {
      const [staff, suppliers, products] = await Promise.all([
        getAllStaff(),
        getAllSuppliers(),
        getAllProducts(),
      ]);
      setStaffList(Array.isArray(staff) ? staff : []);
      setSupplierList(Array.isArray(suppliers) ? suppliers : []);
      setProductList(Array.isArray(products) ? products : []);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to load form data");
    } finally {
      setRefsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRefs();
  }, [loadRefs]);

  const selectedSupplier = useMemo(
    () => supplierList.find((s) => s.id === supplierId) ?? null,
    [supplierList, supplierId]
  );

  const supplierSummary = selectedSupplier
    ? `${selectedSupplier.name}${selectedSupplier.phone ? ` · ${selectedSupplier.phone}` : ""}`
    : "";

  const productById = useMemo(() => {
    const m = new Map<string, ProductResponse>();
    productList.forEach((p) => m.set(p.id, p));
    return m;
  }, [productList]);

  const updateLine = (index: number, patch: Partial<LineDraft>) => {
    setLines((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);

  const removeLine = (index: number) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!staffId.trim()) {
      setFormError("Select a staff member.");
      return;
    }
    if (!supplierId.trim()) {
      setFormError("Select a supplier.");
      return;
    }

    const details: PurchaseDetailCreationRequest[] = [];
    for (let i = 0; i < lines.length; i++) {
      const row = lines[i];
      if (!row.productId.trim()) {
        setFormError(`Select a product on line ${i + 1}.`);
        return;
      }
      const qty = Number.parseInt(row.quantity, 10);
      if (!Number.isFinite(qty) || qty < 1) {
        setFormError(`Invalid quantity on line ${i + 1} (min 1).`);
        return;
      }
      const price = Number.parseFloat(row.unitPrice);
      if (!Number.isFinite(price) || price <= 0) {
        setFormError(`Unit price on line ${i + 1} must be greater than 0.`);
        return;
      }
      details.push({
        productId: row.productId.trim(),
        quantity: qty,
        unitPrice: price,
      });
    }

    if (details.length === 0) {
      setFormError("Add at least one line item.");
      return;
    }

    setSubmitting(true);
    try {
      await createPurchase({
        staffId: staffId.trim(),
        supplierId: supplierId.trim(),
        purchaseDetails: details,
      });
      navigate("/admin/purchases");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Create purchase failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full w-full flex flex-col bg-slate-50">
      <style>{`
        @keyframes slideFromRight {
          from { transform: translateX(100%); opacity: 0.9; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <header className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/admin/purchases"
                className="text-white/90 hover:text-white text-sm font-semibold shrink-0"
              >
                ← Purchases
              </Link>
              <div className="min-w-0">
                <h1 className="text-lg font-bold truncate">Add purchase</h1>
                <p className="text-emerald-100 text-xs">Staff, supplier & line items</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          {refsLoading && (
            <p className="text-sm text-slate-500">Loading suppliers, staff, and products…</p>
          )}

          {formError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-rose-800 text-sm">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Staff</label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              required
              disabled={refsLoading}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="">— Select staff —</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {staffLabel(s)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
            <div className="flex gap-2">
              <div className="flex-1 min-w-0">
                <div className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-800 min-h-[42px] flex items-center">
                  {selectedSupplier ? (
                    <span className="truncate" title={supplierSummary}>
                      {supplierSummary}
                    </span>
                  ) : (
                    <span className="text-slate-400">— Choose supplier —</span>
                  )}
                </div>
                {selectedSupplier && (
                  <p className="text-xs text-slate-500 mt-1 font-mono truncate">{selectedSupplier.id}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSupplierBoardOpen(true)}
                disabled={refsLoading}
                className="shrink-0 px-3.5 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                title="Search supplier by detail"
                aria-label="Open supplier search"
              >
                …
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Line items</label>
              <button
                type="button"
                onClick={addLine}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                + Add line
              </button>
            </div>
            <div className="space-y-3">
              {lines.map((row, i) => {
                const picked = row.productId ? productById.get(row.productId) : undefined;
                return (
                  <div
                    key={i}
                    className="border border-slate-200 rounded-xl p-3 space-y-2 bg-slate-50/80"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Line {i + 1}</span>
                      {lines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLine(i)}
                          className="text-xs text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white text-sm min-h-[38px] flex items-center">
                          {picked ? (
                            <span className="truncate" title={productLabel(picked)}>
                              {productLabel(picked)}
                            </span>
                          ) : (
                            <span className="text-slate-400">— Product —</span>
                          )}
                        </div>
                        {picked && (
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{picked.id}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setProductLineForPicker(i)}
                        disabled={refsLoading}
                        className="shrink-0 px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 self-start"
                        title="Search product by detail"
                        aria-label="Open product search"
                      >
                        …
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-500">Quantity</label>
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={row.quantity}
                          onChange={(e) => updateLine(i, { quantity: e.target.value })}
                          className="w-full px-2 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Unit price (VND)</label>
                        <input
                          type="number"
                          min={0.01}
                          step={0.01}
                          value={row.unitPrice}
                          onChange={(e) => updateLine(i, { unitPrice: e.target.value })}
                          placeholder="0"
                          className="w-full px-2 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/admin/purchases"
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || refsLoading}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Create purchase"}
            </button>
          </div>
        </form>
      </div>

      <SupplierSearchBoard
        open={supplierBoardOpen}
        onClose={() => setSupplierBoardOpen(false)}
        suppliers={supplierList}
        loading={refsLoading}
        onPick={(s) => setSupplierId(s.id)}
      />

      <ProductSearchBoard
        open={productLineForPicker !== null}
        onClose={() => setProductLineForPicker(null)}
        products={productList}
        loading={refsLoading}
        onPick={(p) => {
          const idx = productLineForPicker;
          if (idx === null) return;
          setLines((prev) =>
            prev.map((row, i) =>
              i === idx
                ? {
                    ...row,
                    productId: p.id,
                    unitPrice:
                      p.price != null && p.price > 0
                        ? String(p.price)
                        : row.unitPrice,
                  }
                : row
            )
          );
        }}
      />
    </div>
  );
}
