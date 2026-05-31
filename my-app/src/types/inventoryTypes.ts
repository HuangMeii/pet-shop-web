import type {ProductResponse} from "./productTypes.ts";

export type InventoryStatus =
    | "AVAILABLE"
    | "OUT_OF_STOCK"
    | "DISABLED";

export interface InventoryResponse {
    id: string;
    product: ProductResponse;
    quantity: number;
    status: InventoryStatus;
    createdAt: string;
    updatedAt: string;
}
