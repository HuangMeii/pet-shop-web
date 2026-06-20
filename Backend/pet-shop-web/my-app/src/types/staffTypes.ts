import type { UserCreationRequest, UserResponse, UserUpdateRequest } from "./userTypes.ts";

export interface StaffCreationRequest {
    shift: number;
    userCreationRequest: UserCreationRequest;
}

export interface StaffResponse {
    id: string;
    user: UserResponse;
    shift: number;
}

export interface StaffUpdateRequest extends UserUpdateRequest {
    shift?: number;
}