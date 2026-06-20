"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPromotion } from "../../../services/promotionService";
import { getAllProducts } from "../../../services/productService";
import type { PromotionCreationRequest } from "../../../types/promotionTypes";
import type { ProductResponse } from "../../../types/productTypes";
import ProductSearchBoard from "../../../components/admin/ProductSearchBoard";

function productLabel(p: ProductResponse) {
  return p.name || p.id;
}

type ProductLine = { productId: string };

function emptyLine(): ProductLine {
  return { productId: "" };
}

export default function AddPromotionPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [refsLoading, setRefsLoading] = useState(true);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [discountValue, setDiscountValue] = useState("");
  const [maxDiscountValue, setMaxDiscountValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lines, setLines] = useState<ProductLine[]>([emptyLine()]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [productLineForPicker, setProductLineForPicker] = useState<number | null>(null);

  const loadProducts = useCallback(async () => {
    setRefsLoading(true);
    setFormError(null);
    try {
      const list = await getAllProducts();
      setProducts(Array.isArray(list) ? list : []);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setRefsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const productById = useMemo(() => {
    const m = new Map<string, ProductResponse>();
    products.forEach((p) => m.set(p.id, p));
    return m;
  }, [products]);

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);

  const removeLine = (index: number) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!code.trim()) {
      setFormError("Promotion code is required.");
      return;
    }
    if (!startDate || !endDate) {
      setFormError("Start and end dates are required.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setFormError("Start date must be before end date.");
      return;
    }

    const dv = Number.parseFloat(discountValue);
    if (!Number.isFinite(dv) || dv <= 0) {
      setFormError("Discount value must be greater than 0.");
      return;
    }

    const details: { productId: string }[] = lines
      .map((l) => l.productId.trim())
      .filter(Boolean)
      .map((id) => ({ productId: id }));

    if (details.length === 0) {
      setFormError("Add at least one product (use … to search).");
      return;
    }

    let maxDisc: number | undefined;
    if (maxDiscountValue.trim()) {
      const m = Number.parseFloat(maxDiscountValue);
      if (!Number.isFinite(m) || m <= 0) {
        setFormError("Max discount must be empty or a positive number.");
        return;
      }
      maxDisc = m;
    }

    const body: PromotionCreationRequest = {
      code: code.trim(),
      description: description.trim() || undefined,
      discountType,
      discountValue: dv,
      maxDiscountValue: maxDisc,
      startDate,
      endDate,
      promotionDetails: details,
    };

    setSubmitting(true);
    try {
      await createPromotion(body);
      navigate("/admin/promotions");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Create promotion failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full w-full flex flex-col bg-slate-50">
      <header className="bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/admin/promotions"
                className="text-white/90 hover:text-white text-sm font-semibold shrink-0"
              >
                ← Promotions
              </Link>
              <div className="min-w-0">
                <h1 className="text-lg font-bold truncate">Add promotion</h1>
                <p className="text-violet-100 text-xs">Discount rules & products</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          {refsLoading && <p className="text-sm text-slate-500">Loading products…</p>}

          {formError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-rose-800 text-sm">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={50}
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="e.g. TET2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none resize-y"
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discount type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "PERCENT" | "FIXED")}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none bg-white"
              >
                <option value="PERCENT">Percent (%)</option>
                <option value="FIXED">Fixed amount (VND)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {discountType === "PERCENT" ? "Percent value" : "Amount (VND)"}
              </label>
              <input
                type="number"
                min={0.01}
                step={discountType === "PERCENT" ? 0.1 : 1}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
          </div>

          {discountType === "PERCENT" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Max discount cap (VND, optional)
              </label>
              <input
                type="number"
                min={0.01}
                step={1}
                value={maxDiscountValue}
                onChange={(e) => setMaxDiscountValue(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                placeholder="Optional ceiling for percent promos"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Products in promotion</label>
              <button
                type="button"
                onClick={addLine}
                className="text-sm font-semibold text-violet-600 hover:text-violet-700"
              >
                + Add product
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Use the … button to open the product finder (search by name, brand, category, id, etc.).
            </p>
            <div className="space-y-3">
              {lines.map((row, i) => {
                const picked = row.productId ? productById.get(row.productId) : undefined;
                return (
                  <div
                    key={i}
                    className="border border-slate-200 rounded-xl p-3 space-y-2 bg-slate-50/80"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Product {i + 1}</span>
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
                            <span className="text-slate-400">— Select product —</span>
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
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/admin/promotions"
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || refsLoading}
              className="flex-1 px-4 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Create promotion"}
            </button>
          </div>
        </form>
      </div>

      <ProductSearchBoard
        open={productLineForPicker !== null}
        onClose={() => setProductLineForPicker(null)}
        products={products}
        loading={refsLoading}
        headerClassName="bg-violet-600"
        title="Find product"
        onPick={(p) => {
          const idx = productLineForPicker;
          if (idx === null) return;
          setLines((prev) =>
            prev.map((row, i) => (i === idx ? { ...row, productId: p.id } : row))
          );
        }}
      />
    </div>
  );
}
