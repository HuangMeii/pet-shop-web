"use client";

import type { CartItemResponse } from "../../../../types/cartTypes";

interface SelectAllBarProps {
  items: CartItemResponse[];
  selection: Record<string, boolean>;
  allSelected: boolean;
  onSelectAll: (selectAll: boolean) => void;
}

export default function SelectAllBar({
  items,
  selection,
  allSelected,
  onSelectAll,
}: SelectAllBarProps) {
  const isSelected = (item: CartItemResponse) => selection[item.id] ?? true;
  const selectedCount = items.filter((item) => isSelected(item)).length;
  const totalQuantity = items.reduce((sum, item) => sum + (isSelected(item) ? item.quantity : 0), 0);

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 z-10 shadow-sm">
      {/* Select All Checkbox */}
      <input
        type="checkbox"
        checked={allSelected}
        onChange={(e) => onSelectAll(e.target.checked)}
        className="w-5 h-5 text-blue-600 rounded cursor-pointer focus:ring-2 focus:ring-blue-500"
        aria-label="Chọn tất cả"
      />

      {/* Select All Label */}
      <label
        onClick={() => onSelectAll(!allSelected)}
        className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900"
      >
        Chọn tất cả ({items.length})
      </label>

      {/* Selection Summary */}
      {selectedCount > 0 && (
        <div className="ml-auto flex items-center gap-6">
          <span className="text-sm text-gray-600">
            Đã chọn: <span className="font-bold text-gray-800">{selectedCount}</span> sản phẩm (
            <span className="font-bold text-gray-800">{totalQuantity}</span> cái)
          </span>
        </div>
      )}
    </div>
  );
}
