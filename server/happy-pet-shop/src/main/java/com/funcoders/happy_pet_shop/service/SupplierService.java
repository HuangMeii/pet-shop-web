package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.SupplierCreationRequest;
import com.funcoders.happy_pet_shop.dto.request.SupplierUpdateRequest;
import com.funcoders.happy_pet_shop.dto.response.SupplierResponse;
import com.funcoders.happy_pet_shop.entity.Supplier;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.SupplierMapper;
import com.funcoders.happy_pet_shop.repository.SupplierRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierService {
    SupplierRepository supplierRepository;
    SupplierMapper supplierMapper;

    @Transactional
    public SupplierResponse createSupplier(SupplierCreationRequest request) {
        if (supplierRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorType.PHONE_ALREADY_EXISTS);
        }

        if (request.getEmail() != null
                && supplierRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorType.EMAIL_ALREADY_EXISTS);
        }

        Supplier supplierEntity = supplierMapper.toEntity(request);

        return supplierMapper.toResponse(
                supplierRepository.save(supplierEntity)
        );
    }

    @Transactional(readOnly = true)
    public SupplierResponse getSupplierById(UUID id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        return supplierMapper.toResponse(supplier);
    }

    @Transactional(readOnly = true)
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll()
                .stream()
                .map(supplierMapper::toResponse)
                .toList();
    }

    @Transactional
    public SupplierResponse updateSupplier(UUID id, SupplierUpdateRequest request) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        supplierMapper.updateSupplier(supplier, request);

        return supplierMapper.toResponse(
                supplierRepository.save(supplier)
        );
    }

    @Transactional
    public void deleteSupplier(UUID id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        supplierRepository.delete(supplier);
    }
}