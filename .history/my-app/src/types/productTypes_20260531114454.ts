export interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  categoryName?: string;
  brand?: string;
  origin?: string;
  unit?: string;
  quantity: number;
  expiryDate?: string;
  imageUrl?: string;
  available?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface ProductCreationRequest {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    unit: string;
    categoryId: string; // UUID bên backend → string bên FE
    brand?: string;
    origin?: string;
    imageUrl?: string;
}

export interface ProductUpdateRequest {
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    unit?: string;
    categoryId?: string;
    brand?: string;
    origin?: string;
    expiryDate?: string;
    imageUrl?: string;
    available?: boolean;
}
