import type { InventoryResponse } from "./inventoryTypes";
import type {ProductResponse} from "./productTypes.ts";

export interface CartItemResponse {
    id: string;
    inventory?: InventoryResponse;
    quantity: number;
    product?: ProductResponse;
}

export interface CartResponse {
    id: string;
    cartItems: CartItemResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface CartRequest {
    productId: string;
    quantity: number;
}
