package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.CartRequest;
import com.funcoders.happy_pet_shop.dto.response.CartResponse;
import com.funcoders.happy_pet_shop.entity.Cart;
import com.funcoders.happy_pet_shop.entity.CartItem;
import com.funcoders.happy_pet_shop.entity.Customer;
import com.funcoders.happy_pet_shop.entity.Product;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.CartMapper;
import com.funcoders.happy_pet_shop.repository.CartRepository;
import com.funcoders.happy_pet_shop.repository.CustomerRepository;
import com.funcoders.happy_pet_shop.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CartService {
    CustomerRepository customerRepository;

    ProductRepository productRepository;

    CartRepository cartRepository;
    CartMapper cartMapper;

    @Transactional(readOnly = true)
    public CartResponse getCartByCustomerId(UUID customerId) {

        Cart cart = cartRepository.findByCustomer_Id(customerId)
                .orElseThrow(() -> new AppException(ErrorType.CART_NOT_FOUND));

        return cartMapper.toResponse(cart);
    }

    @Transactional(readOnly = true)
    public CartResponse getCartById(UUID cartId) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorType.CART_NOT_FOUND));

        return cartMapper.toResponse(cart);
    }

    @Transactional
    public CartResponse getOrCreateCart(UUID customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorType.USER_NOT_FOUND));

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .customer(customer)
                                .build()
                ));

        return cartMapper.toResponse(cart);
    }

    @Transactional
    public CartResponse addProduct(UUID customerId, CartRequest request) {
        UUID productId = request.getProductId();
        int quantity = request.getQuantity();

        // find cart
        Cart cart = cartRepository.findByCustomer_Id(customerId)
                .orElseThrow(() -> new AppException(ErrorType.CART_NOT_FOUND));


        // find product to add
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorType.PRODUCT_NOT_FOUND));

        System.out.println(product.getId());

        CartItem existingItem = null;

        for (CartItem item : cart.getCartItems()) {
            if (item.getProduct().getId().equals(productId)) {
                existingItem = item;
                break;
            }
        }

        if (quantity == 0) {
            if (Objects.nonNull(existingItem)) {
                cart.getCartItems().remove(existingItem);
            }
            return cartMapper.toResponse(cartRepository.save(cart));
        }

        if (existingItem != null) {
            existingItem.setQuantity(quantity);
        } else {

            CartItem cartItem = CartItem.builder()
                    .product(product)
                    .quantity(quantity)
                    .cart(cart)
                    .build();

            cart.getCartItems().add(cartItem);
        }

        return cartMapper.toResponse(cartRepository.save(cart));
    }
}

