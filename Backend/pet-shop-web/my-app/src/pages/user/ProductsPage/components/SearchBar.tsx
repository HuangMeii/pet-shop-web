"use client";

import { useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Tìm kiếm sản phẩm"
        />
        <span className="absolute left-4 top-3.5 text-xl">🔍</span>
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Xóa tìm kiếm"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
