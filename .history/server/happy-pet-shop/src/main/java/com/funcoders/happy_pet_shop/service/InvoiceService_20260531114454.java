package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.constant.DiscountType;
import com.funcoders.happy_pet_shop.constant.PaymentStatus;
import com.funcoders.happy_pet_shop.dto.request.*;
import com.funcoders.happy_pet_shop.dto.response.InvoiceResponse;
import com.funcoders.happy_pet_shop.dto.response.ReviewDetailResponse;
import com.funcoders.happy_pet_shop.dto.response.ReviewResponse;
import com.funcoders.happy_pet_shop.entity.*;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.InvoiceMapper;
import com.funcoders.happy_pet_shop.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvoiceService {
    InvoiceRepository invoiceRepository;
    InvoiceMapper invoiceMapper;

    CustomerRepository customerRepository;

    StaffRepository staffRepository;

    PromotionRepository promotionRepository;
    PromotionDetailRepository promotionDetailRepository;

    PetRepository petRepository;

    ProductRepository productRepository;

    @Transactional
    public InvoiceResponse createInvoice(InvoiceCreationRequest request) {

        // ===== 1. Find customer =====
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));

        // ===== 2. Find staff (nullable for online checkout) =====
        Staff staff = null;
        if (request.getStaffId() != null) {
            staff = staffRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));
        }

        // ===== 3. Create invoice =====
        Invoice invoice = Invoice.builder()
                .customer(customer)
                .staff(staff)
                .paymentMethod(request.getPaymentMethod())
                .shippingAddress(request.getShippingAddress())
                .invoiceDetails(new HashSet<>())
                .totalAmount(BigDecimal.ZERO)
                .realAmount(BigDecimal.ZERO)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal realAmount = BigDecimal.ZERO;

        // ===== 4. Load products =====
        Set<UUID> productIds = request.getInvoiceDetails()
                .stream()
                .map(InvoiceDetailCreationRequest::getProductId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<Product> products = productRepository.findAllById(productIds);

        Map<UUID, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        // ===== 5. Load promotions =====
        Map<UUID, PromotionDetail> bestPromotionByProduct = new HashMap<>();
        if (!productIds.isEmpty()) {
            List<PromotionDetail> promotionDetails =
                    promotionDetailRepository.findActivePromotionDetails(productIds, LocalDate.now());

            bestPromotionByProduct = promotionDetails.stream()
                    .collect(Collectors.toMap(
                            pd -> pd.getProduct().getId(),
                            pd -> pd,
                            (pd1, pd2) -> {
                                BigDecimal d1 = calculateDiscountAmount(
                                        pd1,
                                        pd1.getProduct().getPrice()
                                );
                                BigDecimal d2 = calculateDiscountAmount(
                                        pd2,
                                        pd2.getProduct().getPrice()
                                );
                                return d1.compareTo(d2) >= 0 ? pd1 : pd2;
                            }
                    ));
        }

        // ===== 6. Process invoice details =====
        for (InvoiceDetailCreationRequest detailRequest : request.getInvoiceDetails()) {

            if (detailRequest.getProductId() == null && detailRequest.getPetId() == null) {
                throw new AppException(ErrorType.INVALID_INVOICE_DETAIL);
            }

            if (detailRequest.getProductId() != null && detailRequest.getPetId() != null) {
                throw new AppException(ErrorType.INVALID_INVOICE_DETAIL);
            }

            InvoiceDetail detail = new InvoiceDetail();
            detail.setInvoice(invoice);

            // ===== PRODUCT =====
            if (detailRequest.getProductId() != null) {

                Product product = productMap.get(detailRequest.getProductId());

                if (product == null) {
                    throw new AppException(ErrorType.PRODUCT_NOT_FOUND);
                }

                if (!product.isAvailable()) {
                    throw new AppException(ErrorType.PRODUCT_NOT_AVAILABLE);
                }

                if (product.getQuantity() < detailRequest.getQuantity()) {
                    throw new AppException(ErrorType.PRODUCT_NOT_AVAILABLE);
                }

                product.setQuantity(product.getQuantity() - detailRequest.getQuantity());

                detail.setProduct(product);
                detail.setQuantity(detailRequest.getQuantity());
                detail.setUnitPrice(product.getPrice());

                BigDecimal lineTotal = product.getPrice()
                        .multiply(BigDecimal.valueOf(detailRequest.getQuantity()));

                totalAmount = totalAmount.add(lineTotal);

                // ===== APPLY PROMOTION =====
                PromotionDetail promotionDetail =
                        bestPromotionByProduct.get(product.getId());

                BigDecimal discount = BigDecimal.ZERO;

                if (promotionDetail != null) {

                    discount = calculateDiscountAmount(
                            promotionDetail,
                            product.getPrice()
                    ).multiply(BigDecimal.valueOf(detailRequest.getQuantity()));

                    detail.setPromotionDetail(promotionDetail);
                    detail.setDiscountAmount(discount);
                }

                realAmount = realAmount.add(lineTotal.subtract(discount));
            }

            // ===== PET =====
            if (detailRequest.getPetId() != null) {

                Pet pet = petRepository.findById(detailRequest.getPetId())
                        .orElseThrow(() -> new AppException(ErrorType.PET_NOT_FOUND));

                if (Boolean.FALSE.equals(pet.getAvailable())) {
                    throw new AppException(ErrorType.PET_ALREADY_SOLD);
                }

                detail.setPet(pet);
                detail.setQuantity(1);
                detail.setUnitPrice(pet.getPrice());

                totalAmount = totalAmount.add(pet.getPrice());
                realAmount = realAmount.add(pet.getPrice());

                pet.markAsSold();
            }

            invoice.getInvoiceDetails().add(detail);
        }

        invoice.setTotalAmount(totalAmount);
        invoice.setRealAmount(realAmount);

        Invoice saved = invoiceRepository.save(invoice);

        InvoiceResponse response = invoiceMapper.toResponse(saved);
        return response;
    }

    @Transactional(readOnly = true)
    public ReviewResponse createReview(ReviewRequest request) {
        // ===== 1. Find customer =====
        String customerName = "";

        Customer customer = null;

        if (Objects.nonNull(request.getCustomerId()))
            customer = customerRepository.findById(request.getCustomerId()).orElse(null);

        if (customer != null) {
            customerName = customer.getUser().getFirstName() + " " + customer.getUser().getLastName();
            if (customerName.isBlank()) {
                customerName = customer.getUser().getUsername();
            }
        }

        // ===== 2. Load products =====
        Set<UUID> productIds = request.getDetails().stream()
                .map(ReviewDetailRequest::getProductId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<Product> products = productRepository.findAllById(productIds);
        Map<UUID, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        // ===== 3. Load promotions =====
        Map<UUID, PromotionDetail> bestPromotionByProduct = new HashMap<>();
        if (!productIds.isEmpty()) {
            List<PromotionDetail> promotionDetails =
                    promotionDetailRepository.findActivePromotionDetails(productIds, LocalDate.now());

            bestPromotionByProduct = promotionDetails.stream()
                    .collect(Collectors.toMap(
                            pd -> pd.getProduct().getId(),
                            pd -> pd,
                            (pd1, pd2) -> {
                                BigDecimal d1 = calculateDiscountAmount(
                                        pd1,
                                        pd1.getProduct().getPrice()
                                );
                                BigDecimal d2 = calculateDiscountAmount(
                                        pd2,
                                        pd2.getProduct().getPrice()
                                );
                                return d1.compareTo(d2) >= 0 ? pd1 : pd2;
                            }
                    ));
        }

        // ===== 4. Build review details and calculate totals =====
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal realAmount = BigDecimal.ZERO;
        Set<ReviewDetailResponse> reviewDetails = new LinkedHashSet<>();

        for (ReviewDetailRequest detailRequest : request.getDetails()) {
            if (detailRequest.getProductId() == null) {
                throw new AppException(ErrorType.INVALID_INVOICE_DETAIL);
            }

            Product product = productMap.get(detailRequest.getProductId());
            if (product == null) {
                throw new AppException(ErrorType.PRODUCT_NOT_FOUND);
            }
            if (!product.isAvailable()) {
                throw new AppException(ErrorType.PRODUCT_NOT_AVAILABLE);
            }
            if (product.getQuantity() < detailRequest.getQuantity()) {
                throw new AppException(ErrorType.PRODUCT_NOT_AVAILABLE);
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(detailRequest.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            PromotionDetail promotionDetail = bestPromotionByProduct.get(product.getId());
            BigDecimal discount = BigDecimal.ZERO;
            if (promotionDetail != null) {
                discount = calculateDiscountAmount(promotionDetail, product.getPrice())
                        .multiply(BigDecimal.valueOf(detailRequest.getQuantity()));
            }
            realAmount = realAmount.add(lineTotal.subtract(discount));

            reviewDetails.add(ReviewDetailResponse.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .imageUrl(product.getImageUrl())
                    .unitPrice(unitPrice)
                    .quantity(detailRequest.getQuantity())
                    .totalPrice(lineTotal)
                    .discountAmount(discount)
                    .build());
        }

        return ReviewResponse.builder()
                .customerName(customerName)
                .shippingAddress(request.getShippingAddress())
                .totalAmount(totalAmount)
                .realAmount(realAmount)
                .reviewDetails(reviewDetails)
                .build();
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream().map(
                invoiceMapper::toResponse
        ).toList();
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(UUID id) {
        return invoiceMapper.toResponse(invoiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.INVOICE_NOT_FOUND)));
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoiceByCustomer_Id(UUID id) {
        List<Invoice> invoices = invoiceRepository.findAllByCustomer_Id(id);

        return invoices.stream().map(invoiceMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoiceByStaff_Id(UUID id) {
        List<Invoice> invoices = invoiceRepository.findAllByStaff_Id(id);

        return invoices.stream().map(invoiceMapper::toResponse).toList();
    }

    @Transactional()
    public void deleteInvoiceById(UUID id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.INVOICE_NOT_FOUND));

        invoiceRepository.delete(invoice);
    }

    @Transactional()
    @PreAuthorize("hasRole('ADMIN')")
    public InvoiceResponse updateInvoiceStatus(UUID id, InvoiceStatusUpdateRequest request) {
        PaymentStatus paymentStatus = request.getPaymentStatus();

        Invoice managedInvoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.INVOICE_NOT_FOUND));

        managedInvoice.setStatus(paymentStatus);

        return invoiceMapper.toResponse(invoiceRepository.save(managedInvoice));
    }

    private BigDecimal calculateDiscountAmount(PromotionDetail promotionDetail, BigDecimal productPrice) {
        if (promotionDetail.getPromotion().getDiscountType() == DiscountType.PERCENT) {
            BigDecimal percentDiscount = productPrice
                    .multiply(promotionDetail.getPromotion().getDiscountValue())
                    .divide(BigDecimal.valueOf(100));

            if (promotionDetail.getPromotion().getMaxDiscountValue() != null) {
                return percentDiscount.min(promotionDetail.getPromotion().getMaxDiscountValue());
            }

            return percentDiscount;
        }

        // FIXED
        return promotionDetail.getPromotion().getDiscountValue();
    }
}