package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.constant.PromotionStatus;
import com.funcoders.happy_pet_shop.dto.request.PromotionCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.PromotionDetailCreationRequest;
import com.funcoders.happy_pet_shop.dto.response.PromotionResponse;
import com.funcoders.happy_pet_shop.entity.Promotion;
import com.funcoders.happy_pet_shop.entity.PromotionDetail;
import com.funcoders.happy_pet_shop.entity.Product;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.PromotionMapper;
import com.funcoders.happy_pet_shop.repository.PromotionRepository;
import com.funcoders.happy_pet_shop.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PromotionService {

    PromotionRepository promotionRepository;
    PromotionMapper promotionMapper;
    ProductRepository productRepository;

    @Transactional
    public PromotionResponse createPromotion(PromotionCreationRequest request) {

        if (promotionRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorType.BAD_REQUEST);
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new AppException(ErrorType.BAD_REQUEST);
        }

        Promotion promotionEntity = promotionMapper.toEntity(request);

        if (promotionEntity.getStatus() == null) {
            promotionEntity.setStatus(PromotionStatus.ACTIVE);
        }

        Set<PromotionDetail> details = new HashSet<>();
        if (request.getPromotionDetails() != null && !request.getPromotionDetails().isEmpty()) {
            for (PromotionDetailCreationRequest detailRequest : request.getPromotionDetails()) {
                Product product = productRepository.findById(detailRequest.getProductId())
                        .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));
                PromotionDetail detail = PromotionDetail.builder()
                        .promotion(promotionEntity)
                        .product(product)
                        .build();
                details.add(detail);
            }
        }
        promotionEntity.setPromotionDetails(details);

        Promotion savedPromotion = promotionRepository.save(promotionEntity);

        return promotionMapper.toResponse(savedPromotion);
    }

    @Transactional(readOnly = true)
    public PromotionResponse getPromotionById(UUID id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        return promotionMapper.toResponse(promotion);
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAll()
                .stream()
                .map(promotionMapper::toResponse)
                .toList();
    }

    @Transactional
    public void deletePromotion(UUID id) {
        if (!promotionRepository.existsById(id)) {
            throw new AppException(ErrorType.NOT_FOUND);
        }
        promotionRepository.deleteById(id);
    }
}

