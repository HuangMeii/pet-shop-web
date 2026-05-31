"use client";

import ProductCard from "./components/ProductCard";
import CategoryFilter from "./components/CategoryFilter";
import PriceFilter from "./components/PriceFilter";
import Pagination from "./components/Pagination";

import {useProductManager} from "./hooks/useProductManager";
import {useEffect, useState} from "react";
import type {ProductResponse} from "@/types/productTypes";
import Loader from "@/components/ui/loader";
import axios from "axios";
import {getAllProducts} from "@/services/productService";

export default function ProductsPage() {
  const ITEMS_PER_PAGE = 12;

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Lỗi từ server");
        } else {
          setError("Lỗi không xác định");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const {
    minPrice,
    maxPrice,
    sortBy,
    currentPage,
    paginatedProducts,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    handlePriceFilterChange,
    handleSort,
    handlePageChange,
    resetFilters,
  } = useProductManager({
    products: products,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return (
      <div className="bg-[#FFF8F0] font-body">
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
        {/* Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <img
            src="https://i.pinimg.com/1200x/79/54/fe/7954fe5fac405a381f2af964ef774abb.jpg"
            alt="Happy Pet Shop Banner"
            className="w-full h-auto max-h-[400px] object-cover rounded-2xl shadow-md"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            <div className="lg:col-span-1 space-y-6 sticky top-20 self-start">

              <div className="bg-white rounded-2xl shadow-md p-5">
                <CategoryFilter />
              </div>

              <div className="bg-white rounded-2xl shadow-md p-5">
                <PriceFilter
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onMinChange={(value) => handlePriceFilterChange(value, maxPrice)}
                    onMaxChange={(value) => handlePriceFilterChange(minPrice, value)}
                    onSort={handleSort}
                    currentSort={sortBy}
                />
              </div>

              {/* Small banner below filters */}
              <div className="rounded-2xl overflow-hidden shadow-md h-48">
                <img
                  src="https://i.pinimg.com/1200x/79/54/fe/7954fe5fac405a381f2af964ef774abb.jpg"
                  alt="Happy Pet Shop"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

            </div>


            <div className="lg:col-span-3">

              {paginatedProducts.length > 0 ? (

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

                    {paginatedProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.imageUrl?? ""}
                            availableAmount={product.quantity}
                            purchaseCount={product.purchaseCount ?? 0}
                        />
                    ))}

                  </div>

              ) : (

                  /* EMPTY STATE */

                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">

                    <div className="text-6xl mb-4">🐶</div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Không tìm thấy sản phẩm
                    </h2>

                    <p className="text-gray-600 mb-6">
                      Không có sản phẩm nào phù hợp với bộ lọc của bạn.
                    </p>

                    <button
                        onClick={resetFilters}
                        className="bg-[#ff8e53] hover:bg-[#ff7a3d] text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                      Xóa tất cả bộ lọc
                    </button>

                  </div>

              )}


              {/* PAGINATION */}
              {totalItems > 0 && (

                  <div className="mt-10">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        startIndex={startIndex}
                        endIndex={endIndex}
                    />
                  </div>

              )}

            </div>
          </div>
        </div>


        {/* LOADING */}
        {loading && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <Loader/>
            </div>
        )}

      </div>
  );
}