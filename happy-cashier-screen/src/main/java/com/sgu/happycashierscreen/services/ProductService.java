package com.sgu.happycashierscreen.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sgu.happycashierscreen.dto.response.ApiResponse;
import com.sgu.happycashierscreen.dto.response.ProductResponse;
import com.sgu.happycashierscreen.util.ApiClient;
import com.sgu.happycashierscreen.util.URLUtil;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE)
public final class ProductService {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    /** Last successful fetch; updated by {@link #fetchAllProducts()}. */
    public static List<ProductResponse> productList;

    /**
     * GET /products — loads all products from the API.
     * Sends JWT when {@link ApiClient#setToken(String)} was called (optional; server allows unauthenticated GET).
     */
    public static List<ProductResponse> fetchAllProducts() throws IOException, InterruptedException {
        String json = ApiClient.get(URLUtil.PRODUCT.GET_ALL, true);
        ApiResponse<List<ProductResponse>> api = OBJECT_MAPPER.readValue(
                json,
                new TypeReference<ApiResponse<List<ProductResponse>>>() {}
        );
        List<ProductResponse> list = api.getData() != null ? api.getData() : Collections.emptyList();
        productList = list;
        return list;
    }

    /**
     * GET /products/paginate?page=&size=
     */
    public static List<ProductResponse> fetchProductsPaginated(int page, int size) throws IOException, InterruptedException {
        String url = URLUtil.PRODUCT.PAGINATE + "?page=" + page + "&size=" + size;
        String json = ApiClient.get(url, true);
        ApiResponse<List<ProductResponse>> api = OBJECT_MAPPER.readValue(
                json,
                new TypeReference<ApiResponse<List<ProductResponse>>>() {}
        );
        List<ProductResponse> list = api.getData() != null ? api.getData() : Collections.emptyList();
        productList = list;
        return list;
    }

    /**
     * GET /products/{id}
     */
    public static ProductResponse fetchProductById(String id) throws IOException, InterruptedException {
        String json = ApiClient.get(URLUtil.PRODUCT.GET_BY_ID(id), true);
        ApiResponse<ProductResponse> api = OBJECT_MAPPER.readValue(
                json,
                new TypeReference<ApiResponse<ProductResponse>>() {}
        );
        return api.getData();
    }
}
