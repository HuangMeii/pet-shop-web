export interface PetCreationRequest {
  name: string;
  species: string;
  breed: string;
  birth: string;
  gender: string;
  price: number;
  vaccinated: boolean;
  imageUrl?: string;
}

export interface PetUpdateRequest {
  name?: string;
  species?: string;
  breed?: string;
  birth: string;
  gender?: string;
  price?: number;
  vaccinated?: boolean;
  imageUrl?: string;
  available?: boolean;
}

export interface PetResponse {
  id: string;
  name: string;
  species: string;
  breed: string;
  birth: string;
  gender: string;
  price: number;
  vaccinated: boolean;
  imageUrl?: string;
  available?: boolean;
  sold?: boolean;
  createdAt: string;
  updatedAt: string;
}
