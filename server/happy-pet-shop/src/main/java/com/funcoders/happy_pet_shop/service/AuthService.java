package com.funcoders.happy_pet_shop.service;

import com.funcoders.happy_pet_shop.dto.request.*;
import com.funcoders.happy_pet_shop.dto.response.AuthResponse;
import com.funcoders.happy_pet_shop.dto.response.UserResponse;

import com.funcoders.happy_pet_shop.dto.response.IntrospectResponse;
import com.funcoders.happy_pet_shop.constant.UserRole;
import com.funcoders.happy_pet_shop.entity.Cart;
import com.funcoders.happy_pet_shop.entity.Customer;
import com.funcoders.happy_pet_shop.entity.InvalidatedToken;
import com.funcoders.happy_pet_shop.entity.Role;
import com.funcoders.happy_pet_shop.entity.User;
import com.funcoders.happy_pet_shop.exception.AppException;
import com.funcoders.happy_pet_shop.exception.ErrorType;
import com.funcoders.happy_pet_shop.mapper.CustomerMapper;
import com.funcoders.happy_pet_shop.mapper.UserMapper;
import com.funcoders.happy_pet_shop.repository.CustomerRepository;
import com.funcoders.happy_pet_shop.repository.InvalidatedTokenRepository;
import com.funcoders.happy_pet_shop.repository.RoleRepository;
import com.funcoders.happy_pet_shop.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    UserRepository userRepository;
    UserMapper userMapper;
    CustomerRepository customerRepository;

    RoleRepository roleRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @Value("${jwt.key}")
    @NonFinal
    protected String SIGNER_KEY;

    @Value("${jwt.expiration-time}")
    @NonFinal
    protected long EXPIRATION_TIME;

    public AuthResponse authenticate(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorType.UNAUTHORIZED));

        if (Objects.nonNull(user.getDeleteAt()))
            throw new AppException(ErrorType.UNAUTHORIZED);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new AppException(ErrorType.UNAUTHORIZED);

        String token = generateToken(user);

        AuthResponse respond = AuthResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
        return respond;
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        String token = request.getToken();

        boolean verified = true;
        try {
            verifyToken(token);
        } catch (AppException e) {
            verified = false;
        }

        return IntrospectResponse.builder()
                .valid(verified)
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            String token = request.getToken();

            SignedJWT signedJWT = verifyToken(token);
            JWTClaimsSet jwtClaimsSet = signedJWT.getJWTClaimsSet();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jwtClaimsSet.getJWTID())
                    .expiryTime(jwtClaimsSet.getExpirationTime())
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (Exception e) {
            log.debug("Logout failed: {}", e.getMessage());
        }
    }

    public AuthResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(request.getToken());
        JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(claimsSet.getJWTID())
                .expiryTime(claimsSet.getExpirationTime())
                .build();

        invalidatedTokenRepository.save(invalidatedToken);

        User userEntity = userRepository.findByUsername(claimsSet.getSubject())
                .orElseThrow(() -> new AppException(ErrorType.UNAUTHORIZED));

        String newToken = generateToken(userEntity);

        return AuthResponse.builder()
                .authenticated(true)
                .token(newToken)
                .build();
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet claimSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .claim("scope", buildScope(user))
                .jwtID(UUID.randomUUID().toString())
                .issuer("domainname")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant
                                .now()
                                .plus(EXPIRATION_TIME, ChronoUnit.SECONDS)
                                .toEpochMilli()
                ))
                .build();
        Payload payload = new Payload(claimSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            AuthService.log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        user.getRoles().forEach(role -> {
            stringJoiner.add("ROLE_" + role.getRoleName());
        });

        return stringJoiner.toString();
    }

    private SignedJWT verifyToken(String token) throws ParseException, JOSEException {
        // parse token into JWT
        SignedJWT signedJWT = SignedJWT.parse(token);

        // create verifier and verify with verifier
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY);
        boolean verified = signedJWT.verify(verifier);

        // get expiration time and verify with expiration time
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        Date now = new Date();
        boolean validExpiry = now.before(expirationTime);

        boolean isLoggedOut = invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID());

        if (!verified || !validExpiry || isLoggedOut)
            throw new AppException(ErrorType.UNAUTHORIZED);

        return signedJWT;
    }

    @Transactional
    public AuthResponse register(UserCreationRequest request) {
        // find customer's role
        Role userRole = roleRepository.findById(UserRole.USER_ROLE)
                .orElseThrow(() -> new AppException(ErrorType.NOT_FOUND));

        // create user entity
        User userEntity = userMapper.toEntity(request);
        userEntity.setUsername(userEntity.getPhone());
        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));
        userEntity.setRoles(Set.of(userRole));

        // create cart
        Cart cart = new Cart();

        // create customer entity
        Customer customer = Customer.builder()
                .user(userEntity)
                .points(BigDecimal.ZERO)
                .cart(cart)
                .build();

        // set customer to cart
        cart.setCustomer(customer);

        // save customer
        Customer savedCustomer = customerRepository.save(customer);

        // create token
        String token = generateToken(userEntity);

        // return register response
        AuthResponse response = AuthResponse.builder()
                .token(token)
                .authenticated(true)
                .build();

        return response;
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
