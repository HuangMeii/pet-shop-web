import { useState, useMemo, useCallback } from "react";
import type { ProductResponse } from "../../../../types/productTypes";

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

interface UseProductManagerOptions {
  products: ProductResponse[];
  itemsPerPage?: number;
}

interface UseProductManagerReturn {
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
  currentPage: number;

  filteredAndSortedProducts: ProductResponse[];
  paginatedProducts: ProductResponse[];
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;

  selectedCategories: string[];
  handleCategoryChange: (categories: string[]) => void;

  handleSearch: (query: string) => void;
  handlePriceFilterChange: (min: number, max: number) => void;
  handleSort: (sortType: string) => void;
  handlePageChange: (page: number) => void;
  resetFilters: () => void;
}

const DEFAULT_ITEMS_PER_PAGE = 12;
const DEFAULT_MAX_PRICE = 1_000_000;

export function useProductManager({
                                    products,
                                    itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
                                  }: UseProductManagerOptions): UseProductManagerReturn {

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(query)
      );
    }

    filtered = filtered.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;

        case "price-desc":
          return b.price - a.price;

        case "name-asc":
          return a.name.localeCompare(b.name);

        case "name-desc":
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, minPrice, maxPrice, sortBy]);

  const totalItems = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
    resetPage();
  }, [resetPage]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    resetPage();
  }, [resetPage]);

  const handlePriceFilterChange = useCallback((min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    resetPage();
  }, [resetPage]);

  const handleSort = useCallback((sortType: string) => {
    if (["price-asc", "price-desc", "name-asc", "name-desc"].includes(sortType)) {
      setSortBy(sortType as SortOption);
      resetPage();
    }
  }, [resetPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setSortBy("price-asc");
    setCurrentPage(1);
  }, []);

  return {
    searchQuery,
    minPrice,
    maxPrice,
    sortBy,
    currentPage,

    handleCategoryChange,
    selectedCategories,

    filteredAndSortedProducts,
    paginatedProducts,
    totalItems,
    totalPages,
    startIndex,
    endIndex,

    handleSearch,
    handlePriceFilterChange,
    handleSort,
    handlePageChange,
    resetFilters,
  };
}