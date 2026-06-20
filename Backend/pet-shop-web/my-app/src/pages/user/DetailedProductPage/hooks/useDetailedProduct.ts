import { useState } from "react";

export function useProductDetail() {
  const [quantity, setQuantity] = useState(1);

  return {
    quantity,
    setQuantity,
  };
}
