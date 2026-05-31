"use client";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  onSort: (sortType: string) => void;
  currentSort: string;
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Lọc theo giá</h3>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Chọn khoảng giá
        </label>
        <select
          value={currentRange?.label || "custom"}
          onChange={(e) => {
            const selected = PRICE_RANGES.find((range) => range.label === e.target.value);
            if (selected) {
              handlePriceRangeSelect(selected);
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white cursor-pointer"
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
      </div>


      <h3 className="text-xl font-bold text-gray-800 mb-4">Sắp xếp</h3>
      <div className="mb-6">
        <select
          value={currentSort}
          onChange={(e) => onSort(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white cursor-pointer"
          aria-label="Chọn cách sắp xếp"
        >
          <option value="price-asc">Giá: Thấp → Cao</option>
          <option value="price-desc">Giá: Cao → Thấp</option>
          <option value="name-asc">Tên: A → Z</option>
          <option value="name-desc">Tên: Z → A</option>
        </select>
      </div>
    </div>
  );
}
