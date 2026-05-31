"use client";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  layout?: "sidebar" | "tabs";
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onCategoriesChange,
  layout = "sidebar",
}: CategoryFilterProps) {
  
  const handleToggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((cat) => cat !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handleClearAll = () => {
    onCategoriesChange([]);
  };

  if (layout === "tabs") {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleToggleCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                selectedCategories.includes(category)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              aria-pressed={selectedCategories.includes(category)}
              aria-label={`Lọc theo danh mục ${category}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800">Danh mục</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
            aria-label="Xóa tất cả danh mục đã chọn"
          >
            Xóa
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggleCategory(category)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                aria-label={`Chọn danh mục ${category}`}
              />
              <span
                className={`text-sm transition ${
                  isSelected ? "text-blue-600 font-semibold" : "text-gray-800"
                }`}
              >
                {category}
              </span>
              {isSelected && (
                <span className="ml-auto bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  ✓
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
