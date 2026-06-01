import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { createInvoice, createInvoiceReview } from "../../../services/invoiceService";
import type {
  InvoiceDetailCreationRequest,
  PaymentMethod,
  ReviewDetailRequest,
  ReviewResponse,
} from "../../../types/invoiceTypes";

interface CheckoutItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isSelected: boolean;
}

export interface UseReviewReturn {
  loading: boolean;
  placingOrder: boolean;
  error: string | null;
  review: ReviewResponse | null;
  shippingAddress: string;
  newAddress: string;
  useDefaultAddress: boolean;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (value: PaymentMethod) => void;
  setUseDefaultAddress: (value: boolean) => void;
  setNewAddress: (value: string) => void;
  refreshReview: () => Promise<void>;
  placeOrder: () => Promise<void>;
}

function readCheckoutItems(): CheckoutItem[] {
  try {
    const raw = sessionStorage.getItem("checkoutItems");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item?.productId && Number(item?.quantity) > 0);
  } catch {
    return [];
  }
}

export function useReview(): UseReviewReturn {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [newAddress, setNewAddress] = useState("");

  const defaultAddress = user?.user?.address ?? "";
  const checkoutItems = useMemo(() => readCheckoutItems(), []);
  const shippingAddress = useDefaultAddress ? defaultAddress : newAddress;

  const buildReviewDetails = useCallback(
    (): ReviewDetailRequest[] =>
      checkoutItems.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
      })),
    [checkoutItems]
  );

  const refreshReview = useCallback(async () => {
    if (!user?.id) return;
    if (checkoutItems.length === 0) {
      setError("Không có sản phẩm được chọn để thanh toán.");
      return;
    }
    if (!shippingAddress.trim()) {
      setError("Vui lòng nhập địa chỉ giao hàng.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await createInvoiceReview({
        customerId: user.id,
        shippingAddress: shippingAddress.trim(),
        details: buildReviewDetails(),
      });
      setReview(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải thông tin đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, checkoutItems, shippingAddress, buildReviewDetails]);

  const placeOrder = useCallback(async () => {
    if (!user?.id) return;
    if (!shippingAddress.trim()) {
      setError("Vui lòng nhập địa chỉ giao hàng.");
      return;
    }
    if (checkoutItems.length === 0) {
      setError("Không có sản phẩm để đặt hàng.");
      return;
    }

    const invoiceDetails: InvoiceDetailCreationRequest[] = checkoutItems.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    }));

    setPlacingOrder(true);
    setError(null);
    try {
      const invoice = await createInvoice({
        customerId: user.id,
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
        invoiceDetails,
      });

      sessionStorage.removeItem("checkoutItems");
      navigate(`/user/invoices/${invoice.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Đặt hàng thất bại.");
    } finally {
      setPlacingOrder(false);
    }
  }, [user?.id, shippingAddress, checkoutItems, paymentMethod, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (checkoutItems.length === 0) {
      setError("Không có sản phẩm được chọn. Vui lòng quay lại giỏ hàng.");
      return;
    }
    if (!useDefaultAddress && !newAddress.trim()) {
      return;
    }
    if (useDefaultAddress && !defaultAddress.trim()) {
      return;
    }
    void refreshReview();
  }, [
    isAuthenticated,
    navigate,
    checkoutItems.length,
    useDefaultAddress,
    newAddress,
    defaultAddress,
    refreshReview,
  ]);

  return {
    loading,
    placingOrder,
    error,
    review,
    shippingAddress,
    newAddress,
    useDefaultAddress,
    paymentMethod,
    setPaymentMethod,
    setUseDefaultAddress,
    setNewAddress,
    refreshReview,
    placeOrder,
  };
}
