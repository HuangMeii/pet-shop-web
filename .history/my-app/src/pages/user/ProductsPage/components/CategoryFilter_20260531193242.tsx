"use client";

import { useState } from "react";

const STATIC_CATEGORIES = [
  { label: "Yêu thích", icon: "❤️" },
  { label: "Mua nhiều", icon: "🔥" },
  { label: "Đánh giá cao", icon: "🌟" },
  { label: "Mới nhất", icon: "🆕" },
];

export default function CategoryFilter() {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="bg-white p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Danh mục</h3>
      <div className="flex flex-col gap-1">
        {STATIC_CATEGORIES.map((cat) => {
          const isChecked = selected.includes(cat.label);
          return (
            <label
              key={cat.label}
              className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(cat.label)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <span className="text-base">{cat.icon}</span>
              <span className={`text-sm transition ${isChecked ? "text-blue-600 font-semibold" : "text-gray-800"}`}>
                {cat.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
