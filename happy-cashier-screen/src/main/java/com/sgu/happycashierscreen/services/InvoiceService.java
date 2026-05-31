package com.sgu.happycashierscreen.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sgu.happycashierscreen.dto.request.InvoiceCreationRequest;
import com.sgu.happycashierscreen.dto.request.ReviewRequest;
import com.sgu.happycashierscreen.dto.response.ApiResponse;
import com.sgu.happycashierscreen.dto.response.InvoiceResponse;
import com.sgu.happycashierscreen.dto.response.ReviewResponse;
import com.sgu.happycashierscreen.util.ApiClient;
import com.sgu.happycashierscreen.util.URLUtil;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static com.sgu.happycashierscreen.util.ObjectMapperUtil.OBJECT_MAPPER;

@FieldDefaults(level = AccessLevel.PRIVATE)
public final class InvoiceService {

    /** Last successful result of {@link #fetchAllInvoices()}. */
    public static List<InvoiceResponse> invoiceList;

    /**
     * POST /invoices/review — preview totals before creating an invoice.
     */
    public static ReviewResponse createReview(ReviewRequest request) throws IOException, InterruptedException {
        String body = OBJECT_MAPPER.writeValueAsString(request);
        System.out.println("body: " + body);
        String json = ApiClient.post(URLUtil.INVOICE.REVIEW, body, true);
        ApiResponse<ReviewResponse> api = OBJECT_MAPPER.readValue(
                json,
                new TypeReference<ApiResponse<ReviewResponse>>() {}
        );
        return api.getData();
    }

    /**
     * POST /invoices — create invoice (HTTP 201 on server).
     */
    public static InvoiceResponse createInvoice(InvoiceCreationRequest request) throws IOException, InterruptedException {
        String body = OBJECT_MAPPER.writeValueAsString(request);
        String json = ApiClient.post(URLUtil.INVOICE.CREATE, body, true);
        ApiResponse<InvoiceResponse> api = OBJECT_MAPPER.readValue(
                json,
                new TypeReference<ApiResponse<InvoiceResponse>>() {}
        );
        return api.getData();
    }

    /**
     * GET /invoices/{id}
     */
    public static InvoiceResponse getInvoiceById(UUID id) throws IOException, InterruptedException {
        String json = ApiClient.get(URLUtil.INVOICE.GET_BY_ID(id.toString()), true);
        ApiResponse<InvoiceResponse> api = OBJECT_MAPPER.readValue(
                json,
                new TypeReference<ApiResponse<InvoiceResponse>>() {}
        );
        return api.getData();
    }

    /**
     * GET /invoices
     */
    public static List<InvoiceResponse> fetchAllInvoices() throws IOException, InterruptedException {
        String json = ApiClient.get(URLUtil.INVOICE.GET_ALL, true);
        ApiResponse<List<InvoiceResponse>> api = OBJECT_MAPPER.readValue(
                json,
                new TypeReference<ApiResponse<List<InvoiceResponse>>>() {}
        );
        List<InvoiceResponse> list = api.getData() != null ? api.getData() : Collections.emptyList();
        invoiceList = list;
        return list;
    }

    /**
     * GET /invoices/customer/{id}
     */
    public static List<InvoiceResponse> getInvoicesByCustomerId(UUID customerId) throws IOException, InterruptedException {
        String json = ApiClient.get(URLUtil.INVOICE.GET_BY_CUSTOMER(customerId.toString()), true);
        ApiResponse<List<InvoiceResponse>> api = OBJECT_MAPPER.readValue(
                json,
                new TypeReference<ApiResponse<List<InvoiceResponse>>>() {}
        );
        return api.getData() != null ? api.getData() : Collections.emptyList();
    }

    /**
     * GET /invoices/staff/{id}
     */
    public static List<InvoiceResponse> getInvoicesByStaffId(UUID staffId) throws IOException, InterruptedException {
        String json = ApiClient.get(URLUtil.INVOICE.GET_BY_STAFF(staffId.toString()), true);
        ApiResponse<List<InvoiceResponse>> api = OBJECT_MAPPER.readValue(
                json,
                new TypeReference<ApiResponse<List<InvoiceResponse>>>() {}
        );
        return api.getData() != null ? api.getData() : Collections.emptyList();
    }

    /**
     * DELETE /invoices/{id}
     */
    public static void deleteInvoice(UUID id) throws IOException, InterruptedException {
        ApiClient.delete(URLUtil.INVOICE.DELETE(id.toString()), true);
    }
}
