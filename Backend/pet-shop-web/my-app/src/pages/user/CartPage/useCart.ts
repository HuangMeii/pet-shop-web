import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { getInfo } from "../../../services/customerService";
import { addOrUpdateCartItem } from "../../../services/cartService";
import type { CartItemResponse } from "../../../types/cartTypes";

export function getProductId(item: CartItemResponse): string {
  return item.product?.id ?? item.inventory?.product?.id ?? item.id;
}

export interface UseCartReturn {
  items: CartItemResponse[];
  selection: Record<string, boolean>;
  allSelected: boolean;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  toggleSelect: (id: string) => void;
  selectAll: (selectAll: boolean) => void;
  // incrementQuantity: (id: string) => void;
  // decrementQuantity: (id: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeItem: (id: string) => void;
  checkout: () => void;
  refreshCart: () => Promise<void>;
}

export function useCart(): UseCartReturn {
  const { user, setUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selection, setSelection] = useState<Record<string, boolean>>({});
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items: CartItemResponse[] = (user?.cart?.cartItems ?? []).filter(
    (item) => item.quantity > 0
  );

  const refreshCart = useCallback(async () => {
    try {
      const customer = await getInfo();
      setUser(customer);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải giỏ hàng");
    }
  }, [setUser]);

  const toggleSelect = useCallback((id: string) => {
    setSelection((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const selectAll = useCallback((selectAll: boolean) => {
    setSelection((prev) => {
      const next = { ...prev };
      items.forEach((item) => {
        next[item.id] = selectAll;
      });
      return next;
    });
  }, [items]);

  const updateQuantity = useCallback(
    async (productId: string, newQuantity: number) => {
      if (!user?.id) return;
      setError(null);
      try {
        const updatedCart = await addOrUpdateCartItem(user.id, {
          productId,
          quantity: newQuantity,
        });
        const cartItemsWithoutZero = (updatedCart.cartItems ?? []).filter(
          (item) => item.quantity > 0
        );
        setUser({
          ...user,
          cart: { ...updatedCart, cartItems: cartItemsWithoutZero },
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Cập nhật thất bại");
      } finally {
      }
    },
    [user, setUser]
  );

  // const incrementQuantity = useCallback(
  //   (id: string) => {
  //     const item = items.find((i) => i.id === id);
  //     if (!item) return;
  //     updateQuantity(getProductId(item), item.quantity + 1);
  //   },
  //   [items, updateQuantity]
  // );
  //
  // const decrementQuantity = useCallback(
  //   (id: string) => {
  //     const item = items.find((i) => i.id === id);
  //     if (!item) return;
  //     const next = Math.max(0, item.quantity - 1);
  //     updateQuantity(getProductId(item), next);
  //   },
  //   [items, updateQuantity]
  // );

  const removeItem = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      updateQuantity(getProductId(item), 0);
    },
    [items, updateQuantity]
  );

  const checkout = useCallback(() => {
    const selected = items.filter((item) => selection[item.id] ?? true);
    if (selected.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
    setError(null);
    const product = (item: CartItemResponse) => item.product ?? item.inventory?.product;
    const payload = selected.map((item) => ({
      id: item.id,
      productId: getProductId(item),
      name: product(item)?.name ?? "Sản phẩm",
      price: product(item)?.price ?? 0,
      quantity: item.quantity,
      image: product(item)?.imageUrl ?? "",
      isSelected: true,
    }));
    sessionStorage.setItem("checkoutItems", JSON.stringify(payload));
    navigate("/user/review");
  }, [items, selection, navigate]);

  const allSelected = useMemo(
    () => items.length > 0 && items.every((item) => selection[item.id] ?? true),
    [items, selection]
  );

  return {
    items,
    selection,
    allSelected,
    loading,
    error,
    isAuthenticated,
    toggleSelect,
    selectAll,
    updateQuantity,
    removeItem,
    checkout,
    refreshCart,
  };
}
