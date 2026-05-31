"use client";

import { useEffect, useState } from "react";
import { getAllCategories } from "../../../../services/categoryService";
import type { CategoryResponse } from "../../../../types/categoryTypes";

export default function CategoryFilter() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    getAllCategories().then(setCategories).catch(() => {});
  }, []);

  const handleToggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="bg-white p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Danh mục</h3>
      <div className="flex flex-col gap-1">
        {categories.map((cat) => {
          const isChecked = selected.includes(cat.name);
          return (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(cat.name)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <span className={`text-sm transition ${isChecked ? "text-blue-600 font-semibold" : "text-gray-800"}`}>
                {cat.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
