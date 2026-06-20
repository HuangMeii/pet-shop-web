interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

const PaginationControls = ({ current, total, onChange }: PaginationProps) => {
  if (total <= 1) return null;
  
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center mt-6">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
      >
        ← Trước
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            current === page ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
      >
        Sau →
      </button>
    </div>
  );
};

export default PaginationControls;