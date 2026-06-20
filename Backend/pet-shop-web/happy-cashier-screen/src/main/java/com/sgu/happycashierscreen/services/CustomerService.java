package com.sgu.happycashierscreen.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sgu.happycashierscreen.dto.response.ApiResponse;
import com.sgu.happycashierscreen.dto.response.CustomerResponse;
import com.sgu.happycashierscreen.util.ApiClient;
import com.sgu.happycashierscreen.util.URLUtil;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import static com.sgu.happycashierscreen.util.ObjectMapperUtil.OBJECT_MAPPER;

@FieldDefaults(level = AccessLevel.PRIVATE)
public final class CustomerService {

    /**
     * GET /customers — list all customers (filter by username on client).
     */
    public static List<CustomerResponse> fetchAllCustomers() throws IOException, InterruptedException {
        String json = ApiClient.get(URLUtil.CUSTOMER.GET_ALL, true);
        ApiResponse<List<CustomerResponse>> api = OBJECT_MAPPER.readValue(
                json,
                new TypeReference<ApiResponse<List<CustomerResponse>>>() {}
        );
        return api.getData() != null ? api.getData() : Collections.emptyList();
    }
}
