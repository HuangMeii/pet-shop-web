import { apiClient } from "../utils/apiClient";
import type {
    InvoiceResponse,
    InvoiceCreationRequest,
    InvoiceStatusUpdateRequest,
    ReviewRequest,
    ReviewResponse,
} from "../types/invoiceTypes";
import type { ApiResponse } from "../types/apiResponse";
import { API_CONFIG } from "../config/apiConfig";

export const createInvoice = async (
    request: InvoiceCreationRequest
): Promise<InvoiceResponse> => {
    const res = await apiClient.post<ApiResponse<InvoiceResponse>>(
        API_CONFIG.ENDPOINTS.INVOICE.CREATE,
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Create invoice failed");
    }
    return apiRes.data;
};

export const createInvoiceReview = async (
    request: ReviewRequest
): Promise<ReviewResponse> => {
    const res = await apiClient.post<ApiResponse<ReviewResponse>>(
        API_CONFIG.ENDPOINTS.INVOICE.REVIEW,
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Create invoice review failed");
    }
    return apiRes.data;
};

export const getAllInvoices = async (): Promise<InvoiceResponse[]> => {
    const res = await apiClient.get<ApiResponse<InvoiceResponse[]>>(
        API_CONFIG.ENDPOINTS.INVOICE.GET_ALL
    );
    return res.data?.data ?? [];
};

export const getInvoiceById = async (id: string): Promise<InvoiceResponse> => {
    const res = await apiClient.get<ApiResponse<InvoiceResponse>>(
        API_CONFIG.ENDPOINTS.INVOICE.GET_BY_ID(id)
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Get invoice failed");
    }
    return apiRes.data;
};

export const deleteInvoice = async (id: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.ENDPOINTS.INVOICE.DELETE(id));
};

export const updateInvoiceStatus = async (
    id: string,
    request: InvoiceStatusUpdateRequest
): Promise<InvoiceResponse> => {
    const res = await apiClient.put<ApiResponse<InvoiceResponse>>(
        API_CONFIG.ENDPOINTS.INVOICE.UPDATE_STATUS(id),
        request
    );
    const apiRes = res.data;
    if (!apiRes.success || apiRes.data == null) {
        throw new Error(apiRes.message ?? "Update invoice status failed");
    }
    return apiRes.data;
};

export const getInvoicesByCustomerId = async (
    customerId: string
): Promise<InvoiceResponse[]> => {
    const res = await apiClient.get<ApiResponse<InvoiceResponse[]>>(
        API_CONFIG.ENDPOINTS.INVOICE.GET_BY_CUSTOMER(customerId)
    );
    return res.data?.data ?? [];
};
