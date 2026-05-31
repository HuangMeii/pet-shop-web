"use client";

import { useState, useEffect, useCallback } from "react";

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  description?: string;
  images: string[];
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  price: number | string;
  stock: number | string;
  description: string;
  images: string[];
  status: "active" | "inactive";
}

interface FormErrors {
  name?: string;
  sku?: string;
  category?: string;
  price?: string;
  stock?: string;
}

// Mock categories
const categories = [
  "Thức ăn cho chó",
  "Thức ăn cho mèo",
  "Đồ chơi",
  "Phụ kiện",
  "Vệ sinh",
  "Y tế",
  "Quần áo",
  "Khác",
];

// Mock data
const mockProducts: Product[] = [
  {
    id: "prod_001",
    name: "Thức ăn cao cấp cho chó",
    sku: "DOG-FOOD-001",
    category: "Thức ăn cho chó",
    price: 350000,
    stock: 45,
    status: "active",
    description: "Thức ăn dinh dưỡng cao cấp cho chó mọi lứa tuổi",
    images: ["https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=200"],
    updatedAt: "2026-01-05T10:30:00",
  },
  {
    id: "prod_002",
    name: "Giường mèo êm ái",
    sku: "CAT-BED-002",
    category: "Phụ kiện",
    price: 280000,
    stock: 12,
    status: "active",
    description: "Giường cho mèo chất liệu cotton mềm mại",
    images: ["https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=200"],
    updatedAt: "2026-01-04T14:20:00",
  },
  {
    id: "prod_003",
    name: "Dây xích chó cao cấp",
    sku: "DOG-LEASH-003",
    category: "Phụ kiện",
    price: 95000,
    stock: 0,
    status: "inactive",
    description: "Dây xích chắc chắn, an toàn",
    images: ["https://images.unsplash.com/photo-1558788353-f76d92427f16?w=200"],
    updatedAt: "2026-01-03T09:15:00",
  },
  {
    id: "prod_004",
    name: "Bộ đồ chơi thú cưng",
    sku: "TOY-SET-004",
    category: "Đồ chơi",
    price: 180000,
    stock: 28,
    status: "active",
    description: "Bộ 5 món đồ chơi an toàn cho thú cưng",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200"],
    updatedAt: "2026-01-02T16:45:00",
  },
  {
    id: "prod_005",
    name: "Bộ vệ sinh thú cưng",
    sku: "GROOM-KIT-005",
    category: "Vệ sinh",
    price: 320000,
    stock: 18,
    status: "active",
    description: "Bộ dụng cụ vệ sinh hoàn chỉnh",
    images: ["https://images.unsplash.com/photo-1552053831-71594a27c62d?w=200"],
    updatedAt: "2026-01-01T11:20:00",
  },
];

export default function ManageServicesPage() {
  // State for products
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    images: [],
    status: "active",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilters, statusFilter, products]);

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilters.length > 0) {
      filtered = filtered.filter((p) => categoryFilters.includes(p.category));
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, categoryFilters, statusFilter, products]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilters([]);
    setStatusFilter("");
  };

  // Toggle category filter chips (allows multi-select)
  // const toggleCategoryFilter = (category: string) => {
  //   setCategoryFilters((prev) =>
  //     prev.includes(category)
  //       ? prev.filter((c) => c !== category)
  //       : [...prev, category]
  //   );
  // };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Open create modal
  const handleCreateProduct = () => {
    setModalMode("create");
    setFormData({
      name: "",
      sku: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      images: [],
      status: "active",
    });
    setImagePreview([]);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEditProduct = (product: Product) => {
    setModalMode("edit");
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      images: product.images,
      status: product.status,
    });
    setImagePreview(product.images);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Tên sản phẩm là bắt buộc";
    }

    if (!formData.sku.trim()) {
      errors.sku = "Mã SKU là bắt buộc";
    } else {
      // Check SKU uniqueness
      const isDuplicate = products.some(
        (p) =>
          p.sku === formData.sku &&
          (modalMode === "create" || p.id !== editingProduct?.id)
      );
      if (isDuplicate) {
        errors.sku = "Mã SKU đã tồn tại";
      }
    }

    if (!formData.category) {
      errors.category = "Danh mục là bắt buộc";
    }

    if (!formData.price || parseFloat(formData.price.toString()) <= 0) {
      errors.price = "Giá phải lớn hơn 0";
    }

    if (
      formData.stock === "" ||
      parseInt(formData.stock.toString()) < 0
    ) {
      errors.stock = "Số lượng không hợp lệ";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const productData: Product = {
      id:
        modalMode === "create"
          ? `prod_${Date.now()}`
          : editingProduct!.id,
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price.toString()),
      stock: parseInt(formData.stock.toString()),
      description: formData.description,
      images: imagePreview.length > 0 ? imagePreview : ["https://via.placeholder.com/200"],
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    if (modalMode === "create") {
      setProducts([productData, ...products]);
      alert("Thêm sản phẩm thành công!");
    } else {
      setProducts(
        products.map((p) => (p.id === productData.id ? productData : p))
      );
      alert("Cập nhật sản phẩm thành công!");
    }

    setIsModalOpen(false);
  };

  // Handle delete
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
    alert("Xóa sản phẩm thành công!");
  };

  // Handle add image URL
  const handleAddImage = () => {
    const url = prompt("Nhập URL hình ảnh:");
    if (url) {
      setImagePreview([...imagePreview, url]);
    }
  };

  // Handle remove image
  const handleRemoveImage = (index: number) => {
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  // Handle view history (mock)
  const handleViewHistory = (product: Product) => {
    alert(`Xem lịch sử thay đổi cho sản phẩm: ${product.name}\n\n(Chức năng đang được phát triển)`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🛍️ Quản Lý Dịch Vụ
          </h1>
          <p className="text-gray-600">
            Tổng số: <span className="font-bold">{filteredProducts.length}</span> dịch vụ
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Tìm kiếm theo tên
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nhập tên sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>


            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ⚡ Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCreateProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
            >
              <span>➕</span>
              Thêm dịch vụ
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
            >
              <span>🔄</span>
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tên dịch vụ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    thời gian
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Giá
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Cập nhật
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* Image */}
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">
                          {product.name}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-blue-600">
                          {formatCurrency(product.price)}
                        </span>
                      </td>


                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status === "active"
                            ? "Đang bán"
                            : "Ngừng bán"}
                        </span>
                      </td>

                      {/* Updated At */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(product.updatedAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                            title="Chỉnh sửa"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm"
                            title="Xóa"
                          >
                            🗑️
                          </button>
                          <button
                            onClick={() => handleViewHistory(product)}
                            className="text-gray-600 hover:text-gray-800 font-semibold text-sm"
                            title="Lịch sử thay đổi"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">
                    Hiển thị:
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-700">
                    / {filteredProducts.length} sản phẩm
                  </span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                  >
                    ← Trước
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Show first, last, current, and adjacent pages
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">
                {modalMode === "create" ? "➕ Thêm sản phẩm mới" : "✏️ Chỉnh sửa sản phẩm"}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="VD: Thức ăn cho chó cao cấp"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mã SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value.toUpperCase() })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      formErrors.sku ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="VD: DOG-FOOD-001"
                  />
                  {formErrors.sku && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.sku}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const isSelected = formData.category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, category: cat })
                          }
                          className={`px-3 py-2 rounded-lg border text-sm font-semibold transition ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                          }`}
                          aria-pressed={isSelected}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  {formErrors.category && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                  )}
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Giá (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                        formErrors.price ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0"
                      min="0"
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tồn kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                        formErrors.stock ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0"
                      min="0"
                    />
                    {formErrors.stock && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Mô tả chi tiết về sản phẩm..."
                    rows={4}
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Hình ảnh
                  </label>
                  <div className="space-y-3">
                    {imagePreview.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {imagePreview.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-300"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-gray-600 hover:text-blue-600 font-semibold transition"
                    >
                      + Thêm URL hình ảnh
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === "active"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "active" | "inactive",
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">Đang bán</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={formData.status === "inactive"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "active" | "inactive",
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">Ngừng bán</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
              >
                {modalMode === "create" ? "Tạo sản phẩm" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Xác nhận xóa
              </h3>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
