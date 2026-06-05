package com.sgu.happycashierscreen.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sgu.happycashierscreen.util.ApiClient;
import com.sgu.happycashierscreen.util.ObjectMapperUtil;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

/**
 * Service gọi PayOS payment backend (Node.js port 3000)
 * để tạo link thanh toán online và kiểm tra trạng thái.
 */
public final class PaymentService {

    private static final String PAYMENT_BASE_URL = "http://localhost:3000/api/payment";

    private static final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private PaymentService() {}

    /**
     * Tạo link thanh toán PayOS.
     *
     * @param amount      Số tiền (VND)
     * @param description Mô tả (tối đa 25 ký tự)
     * @param orderId     Mã đơn hàng (orderCode trên PayOS)
     * @return Map chứa checkoutUrl, qrCode, orderCode, status
     */
    public static Map<String, Object> createPaymentLink(long amount, String description, String orderId)
            throws IOException, InterruptedException {

        String bodyJson = ObjectMapperUtil.OBJECT_MAPPER.writeValueAsString(Map.of(
                "amount", amount,
                "description", description != null ? description : "Pet Shop",
                "orderId", orderId != null ? orderId : String.valueOf(System.currentTimeMillis() % 1000000)
        ));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(PAYMENT_BASE_URL + "/create"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            return ObjectMapperUtil.OBJECT_MAPPER.readValue(
                    response.body(),
                    new TypeReference<Map<String, Object>>() {}
            );
        } else {
            throw new RuntimeException("PayOS create payment failed: " + response.statusCode()
                    + " - " + response.body());
        }
    }

    /**
     * Kiểm tra trạng thái thanh toán từ PayOS.
     *
     * @param orderCode Mã đơn hàng (orderCode trên PayOS)
     * @return Map chứa status, amount, v.v.
     */
    public static Map<String, Object> getPaymentStatus(String orderCode)
            throws IOException, InterruptedException {

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(PAYMENT_BASE_URL + "/status/" + orderCode))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            return ObjectMapperUtil.OBJECT_MAPPER.readValue(
                    response.body(),
                    new TypeReference<Map<String, Object>>() {}
            );
        } else {
            throw new RuntimeException("PayOS get status failed: " + response.statusCode()
                    + " - " + response.body());
        }
    }

    /**
     * Hủy link thanh toán trên PayOS.
     */
    public static void cancelPayment(String orderCode)
            throws IOException, InterruptedException {

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(PAYMENT_BASE_URL + "/cancel/" + orderCode))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            // OK
        } else {
            throw new RuntimeException("PayOS cancel failed: " + response.statusCode()
                    + " - " + response.body());
        }
    }
}
