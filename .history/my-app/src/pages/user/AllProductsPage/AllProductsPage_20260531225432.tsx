"use client";

import {useEffect, useState} from "react";
import ProductCard from "../ProductsPage/components/ProductCard";
import Pagination from "../ProductsPage/components/Pagination";
import type {ProductResponse} from "@/types/productTypes";
import Loader from "@/components/ui/loader";
import axios from "axios";
import {getAllProducts} from "@/services/productService";

const ITEMS_PER_PAGE = 12;

export default function AllProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  return (
      <div className="bg-[#FFF8F0] font-body min-h-screen">
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
        {/* Product Grid */}
        <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => (
                      <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          image={product.imageUrl ?? ""}
                          availableAmount={product.quantity}
                          purchaseCount={product.purchaseCount ?? 0}
                      />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-10">
                      <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          totalItems={products.length}
                          itemsPerPage={ITEMS_PER_PAGE}
                          startIndex={startIndex}
                          endIndex={endIndex}
                      />
                    </div>
                )}
              </>
          ) : (
              !loading && (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">🐶</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Không có sản phẩm
                    </h2>
                    <p className="text-gray-600">
                      Hiện tại chưa có sản phẩm nào.
                    </p>
                  </div>
              )
          )}
        </div>

        {/* Loading */}
        {loading && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <Loader/>
            </div>
        )}
      </div>
  );
}
