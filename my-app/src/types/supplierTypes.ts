export interface SupplierCreationRequest {
    name: string;
    email?: string;
    phone: string;
    address?: string;
}

export interface SupplierUpdateRequest {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    status?: string;
}

export interface SupplierResponse {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}
