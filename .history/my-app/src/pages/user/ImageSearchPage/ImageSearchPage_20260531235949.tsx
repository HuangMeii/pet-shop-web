"use client";

import { useState, useRef } from "react";
import { searchByImage, searchByImageUrl, searchByText, type ImageSearchResult } from "../../../services/imageSearchService";
import ProductCard from "../ProductsPage/components/ProductCard";
import PetCard from "../PetsPage/components/PetCard";

type SearchMode = "upload" | "url" | "text";

export default function ImageSearchPage() {
  const [mode, setMode] = useState<SearchMode>("upload");
  const [results, setResults] = useState<ImageSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [showAll, setShowAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const INITIAL_SHOW = 3;
  const displayedResults = showAll ? results : results.slice(0, INITIAL_SHOW);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Search
    setLoading(true);
    setError(null);
    setShowAll(false);
    try {
      const data = await searchByImage(file);
      setResults(data);
    } catch (_err) {
      setError("Không thể tìm kiếm. Vui lòng kiểm tra kết nối đến server tìm kiếm hình ảnh.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSearch = async () => {
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
    setLoading(true);
    setError(null);
    setShowAll(false);
    try {
      const data = await searchByImageUrl(urlInput.trim());
      setResults(data);
    } catch (_err) {
      setError("Không thể tìm kiếm. Vui lòng kiểm tra URL hoặc kết nối server.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSearch = async () => {
    if (!textInput.trim()) return;
    setPreviewUrl(null);
    setLoading(true);
    setError(null);
    setShowAll(false);
    try {
      const data = await searchByText(textInput.trim());
      setResults(data);
    } catch (_err) {
      setError("Không thể tìm kiếm. Vui lòng kiểm tra kết nối server.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
        fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };

  return (
    <div className="bg-[#FFF8F0] font-body min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔍 Tìm kiếm bằng hình ảnh
          </h1>
          <p className="text-gray-500">
            Tải ảnh lên hoặc nhập URL để tìm sản phẩm/thú cưng tương tự
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { key: "upload", label: "📤 Tải ảnh lên" },
            { key: "url", label: "🔗 URL ảnh" },
            { key: "text", label: "✏️ Mô tả" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setMode(tab.key as SearchMode);
                setResults([]);
                setError(null);
                setPreviewUrl(null);
                setShowAll(false);
              }}
              className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                mode === tab.key
                  ? "bg-green-500 text-white shadow"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          {mode === "upload" && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-xl shadow-md object-contain"
                  />
                  <p className="text-sm text-gray-400">Nhấn để chọn ảnh khác</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-6xl">📷</div>
                  <p className="text-gray-500 font-medium">
                    Kéo thả ảnh vào đây hoặc nhấn để chọn
                  </p>
                  <p className="text-sm text-gray-400">
                    Hỗ trợ JPG, PNG, WEBP (tối đa 10MB)
                  </p>
                </div>
              )}
            </div>
          )}

          {mode === "url" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUrlSearch()}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
                />
                <button
                  onClick={handleUrlSearch}
                  disabled={loading || !urlInput.trim()}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50 font-medium"
                >
                  Tìm kiếm
                </button>
              </div>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-xl shadow-md object-contain"
                />
              )}
            </div>
          )}

          {mode === "text" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTextSearch()}
                  placeholder="Ví dụ: a brown dog, cat food, small white puppy..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
                />
                <button
                  onClick={handleTextSearch}
                  disabled={loading || !textInput.trim()}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50 font-medium"
                >
                  Tìm kiếm
                </button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["a brown dog", "a white cat", "pet food", "dog toy", "small puppy"].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setTextInput(q);
                      setTimeout(() => handleTextSearch(), 100);
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-center">
              {error}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && results.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Kết quả tìm kiếm ({results.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedResults.map((item) => (
                <div key={`${item.type}-${item.id}`} className="relative">
                  {item.type === "product" ? (
                    <ProductCard
                      id={String(item.id)}
                      name={item.name}
                      price={item.price}
                      image={item.imageUrl}
                      availableAmount={999}
                      purchaseCount={0}
                    />
                  ) : (
                    <PetCard
                      pet={{
                        id: String(item.id),
                        name: item.name,
                        imageUrl: item.imageUrl,
                        price: item.price,
                        species: item.category,
                        breed: "",
                        birth: "",
                        gender: "",
                        vaccinated: false,
                        available: true,
                        createdAt: "",
                        updatedAt: "",
                      }}
                    />
                  )}
                  {/* Similarity badge */}
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                    {Math.round(item.similarity * 100)}%
                  </div>
                </div>
              ))}
            </div>

            {/* Xem thêm / Thu gọn */}
            {results.length > INITIAL_SHOW && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-8 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-medium shadow-md hover:shadow-lg"
                >
                  {showAll ? "Thu gọn" : `Xem tất cả (${results.length})`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* No results */}
        {!loading && !error && results.length === 0 && (previewUrl || urlInput || textInput) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500">Không tìm thấy kết quả phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}
