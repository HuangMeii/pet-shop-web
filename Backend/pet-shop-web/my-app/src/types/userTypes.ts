export interface UserCreationRequest {
    firstName?: string;   // max 50
    lastName?: string;    // max 50
    email: string;        // required, email format, max 100
    phone: string;        // required, (0|+84) + 9 digits
    address?: string;     // max 255
    password: string;     // required, >=6, có chữ hoa, chữ thường, số
}

export interface UserResponse {
    id: string;
    username: string;

    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;

    status: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface UserUpdateRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
