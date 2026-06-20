package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.PurchaseCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.PurchaseDetailCreationRequest;
import com.funcoders.happy_pet_shop.entity.*;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.PurchaseDetailMapper;
import com.funcoders.happy_pet_shop.mapper.PurchaseMapper;
import com.funcoders.happy_pet_shop.dto.response.PurchaseResponse;
import com.funcoders.happy_pet_shop.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PurchaseService {
    PurchaseRepository purchaseRepository;
    PurchaseMapper purchaseMapper;
    PurchaseDetailRepository purchaseDetailRepository;

    PurchaseDetailMapper purchaseDetailMapper;

    StaffRepository staffRepository;

    SupplierRepository supplierRepository;


    ProductRepository productRepository;

    @Transactional
    public PurchaseResponse createPurchase(PurchaseCreationRequest request) {
        List<PurchaseDetailCreationRequest> purchaseDetailRequests = request.getPurchaseDetails();

        Set<PurchaseDetail> purchaseDetails = new HashSet<>();

        // find staff
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));

        // find supplier
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        // create purchase entity with staff and supplier
        Purchase purchaseEntity = Purchase.builder()
                .staff(staff)
                .supplier(supplier)
                .purchaseDetails(purchaseDetails)
                .build();

        //create a hash map of purchase details
        Map<UUID, PurchaseDetailCreationRequest> aggregatedByProduct = new HashMap<>();
        for (PurchaseDetailCreationRequest detail : purchaseDetailRequests) {
            UUID productId = detail.getProductId();
            if (aggregatedByProduct.containsKey(productId)) {
                PurchaseDetailCreationRequest existing = aggregatedByProduct.get(productId);
                if (existing.getUnitPrice().compareTo(detail.getUnitPrice()) != 0) {
                    throw new AppException(ErrorType.BAD_REQUEST);
                }
                aggregatedByProduct.put(productId, PurchaseDetailCreationRequest.builder()
                        .productId(productId)
                        .unitPrice(existing.getUnitPrice())
                        .quantity(existing.getQuantity() + detail.getQuantity())
                        .build());
            } else {
                aggregatedByProduct.put(productId, detail);
            }
        }

        List<UUID> productIds = aggregatedByProduct.keySet().stream().toList();
        List<Product> products = productRepository.findAllById(productIds);

        if (products.size() != productIds.size()) {
            throw new AppException(ErrorType.PRODUCT_NOT_FOUND);
        }

        Map<UUID, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        for (PurchaseDetailCreationRequest detailRequest : aggregatedByProduct.values()) {
            Product product = productMap.get(detailRequest.getProductId());
            if (product == null) {
                throw new AppException(ErrorType.PRODUCT_NOT_FOUND);
            }

            PurchaseDetail purchaseDetailEntity = PurchaseDetail.builder()
                    .purchase(purchaseEntity)
                    .product(product)
                    .unitPrice(detailRequest.getUnitPrice())
                    .quantity(detailRequest.getQuantity())
                    .build();
            purchaseDetailEntity.calculateTotalPrice();

            product.setQuantity(product.getQuantity() + purchaseDetailEntity.getQuantity());
            purchaseDetails.add(purchaseDetailEntity);
        }

        purchaseEntity.recalculateTotalAmount();

        return purchaseMapper.toResponse(purchaseRepository.save(purchaseEntity));
    }

    @Transactional(readOnly = true)
    public List<PurchaseResponse> getAllPurchases() {
        List<Purchase> purchases = purchaseRepository.findAll();

        return purchases
                .stream()
                .map(purchaseMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PurchaseResponse getPurchaseById(UUID id) {
        Purchase purchaseEntity = purchaseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.PURCHASE_NOT_FOUND));

        return purchaseMapper.toResponse(purchaseEntity);
    }

    @Transactional
    public void deletePurchase(UUID id) {
        Purchase purchaseEntity = purchaseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.PURCHASE_NOT_FOUND));

        purchaseRepository.delete(purchaseEntity);
    }
}
