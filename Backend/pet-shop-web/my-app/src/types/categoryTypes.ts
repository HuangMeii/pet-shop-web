export interface CategoryCreationRequest {
    name: string;
    description?: string;
}

export interface CategoryUpdateRequest {
    name: string;
    description?: string;
}

export interface CategoryResponse {
    id: string;
    name: string;
    description?: string;
}
