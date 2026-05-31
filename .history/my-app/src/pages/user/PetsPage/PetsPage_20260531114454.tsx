"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PetCard from "./components/PetCard";
import PetDetailModal from "./components/PetDetailModal";
import Loader from "../../../components/ui/loader";
import { getAllPets } from "../../../services/petService";
import type { PetResponse } from "../../../types/petTypes";

export default function PetsPage() {
  const [pets, setPets] = useState<PetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState<PetResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPets();
        setPets(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Lỗi từ server");
        } else {
          setError("Không thể tải danh sách thú cưng");
        }
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPets = useMemo(() => {
    if (!search.trim()) return pets;
    const q = search.toLowerCase().trim();
    return pets.filter(
      (p) =>
        (p.name ?? "").toLowerCase().includes(q) ||
        (p.species ?? "").toLowerCase().includes(q) ||
        (p.breed ?? "").toLowerCase().includes(q)
    );
  }, [pets, search]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-body">
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center shadow">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🐾 Thú cưng
          </h1>
          <p className="text-gray-600 mb-4">
            Xem danh sách thú cưng đáng yêu đang có tại cửa hàng
          </p>
          <div className="relative max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên, loài, giống..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff8e53] focus:border-[#ff8e53] outline-none bg-white"
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 text-lg">
            Hiển thị{" "}
            <span className="font-bold text-[#ff8e53]">{filteredPets.length}</span>{" "}
            thú cưng
          </p>
        </div>

        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onClick={() => setSelectedPet(pet)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🐕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {search.trim()
                ? "Không tìm thấy thú cưng"
                : "Chưa có thú cưng nào"}
            </h2>
            <p className="text-gray-600 mb-6">
              {search.trim()
                ? "Thử tìm kiếm với từ khóa khác."
                : "Vui lòng quay lại sau."}
            </p>
            {search.trim() && (
              <button
                onClick={() => setSearch("")}
                className="bg-[#ff8e53] hover:bg-[#ff7a3d] text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <PetDetailModal
        pet={selectedPet}
        isOpen={!!selectedPet}
        onClose={() => setSelectedPet(null)}
      />
    </div>
  );
}
