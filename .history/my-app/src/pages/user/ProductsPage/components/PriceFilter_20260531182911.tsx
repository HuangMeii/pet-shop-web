"use client";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  onSort: (sortType: "" | "price-asc" | "price-desc") => void;
  currentSort: "" | "price-asc" | "price-desc";
}

const PRICE_RANGES = [
  { label: "Tất cả giá", min: 0, max: 10000000 },
  { label: "Dưới ₫100,000", min: 0, max: 100000 },
  { label: "₫100,000 - ₫300,000", min: 100000, max: 300000 },
  { label: "₫300,000 - ₫500,000", min: 300000, max: 500000 },
  { label: "Trên ₫500,000", min: 500000, max: 10000000 },
];

export default function PriceFilter({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  onSort,
  currentSort,
}: PriceFilterProps) {
  const findCurrentRange = () => {
    return PRICE_RANGES.find(
      (range) => range.min === minPrice && range.max === maxPrice
    );
  };

  const currentRange = findCurrentRange();

  const handlePriceRangeSelect = (range: (typeof PRICE_RANGES)[0]) => {
    onMinChange(range.min);
    onMaxChange(range.max);
  };

  const handleSortToggle = () => {
    if (currentSort === "") {
      onSort("price-desc");
    } else if (currentSort === "price-desc") {
      onSort("price-asc");
    } else {
      onSort("");
    }
  };

  const getSortIcon = () => {
    if (currentSort === "price-desc") return "↓";
    if (currentSort === "price-asc") return "↑";
    return "○";
  };

  return (
    <div className="bg-white p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Lọc theo giá</h3>

      <div className="flex items-center gap-2">
        <select
          value={currentRange?.label || "custom"}
          onChange={(e) => {
            const selected = PRICE_RANGES.find((range) => range.label === e.target.value);
            if (selected) {
              handlePriceRangeSelect(selected);
            }
          }}
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg bg-white cursor-pointer text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Chọn khoảng giá"
        >
          {PRICE_RANGES.map((range) => (
            <option key={range.label} value={range.label}>
              {range.label}
            </option>
          ))}
          {!currentRange && (
            <option value="custom" selected>
              Tùy chỉnh
            </option>
          )}
        </select>

        <button
          onClick={handleSortToggle}
          className={`flex items-center justify-center w-10 h-10 rounded-full border transition text-base ${
            currentSort === "price-desc"
              ? "bg-blue-600 text-white border-blue-600"
              : currentSort === "price-asc"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
          }`}
          aria-label="Sắp xếp giá"
        >
          {getSortIcon()}
        </button>
      </div>
    </div>
  );
}
