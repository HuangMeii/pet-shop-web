"use client";

const STATIC_CATEGORIES = [
  { label: "Gợi ý", icon: "🎁" },
  { label: "Yêu thích", icon: "❤️" },
  { label: "Mua nhiều", icon: "🔥" },
  { label: "Mua lại", icon: "🛒" },
  { label: "Đánh giá cao", icon: "🌟" },
  { label: "Mới nhất", icon: "🆕" },
  { label: "Giá rẻ", icon: "💸" },
  { label: "Cao cấp", icon: "💎" },
  { label: "Trending", icon: "⚡" },
  { label: "Hot hôm nay", icon: "📈" },
];

export default function CategoryFilter() {
  return (
    <div className="bg-white p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Danh mục</h3>
      <div className="flex flex-col gap-1">
        {STATIC_CATEGORIES.map((cat) => (
          <div
            key={cat.label}
            className="flex items-center gap-2 p-1.5 rounded-lg text-sm text-gray-800"
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
