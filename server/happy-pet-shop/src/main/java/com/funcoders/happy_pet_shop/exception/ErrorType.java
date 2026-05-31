package com.funcoders.happy_pet_shop.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorType {

    // ===== SYSTEM =====
    UNCATEGORIZED("Lỗi không xác định", 9999, HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_SERVER_ERROR("Lỗi hệ thống", 5000, HttpStatus.INTERNAL_SERVER_ERROR),

    // ===== COMMON =====
    BAD_REQUEST("Yêu cầu không hợp lệ", 4000, HttpStatus.BAD_REQUEST),
    NOT_FOUND("Không tìm thấy dữ liệu", 4004, HttpStatus.NOT_FOUND),
    UNAUTHORIZED("Chưa xác thực", 4001, HttpStatus.UNAUTHORIZED),
    FORBIDDEN("Không có quyền truy cập", 4003, HttpStatus.FORBIDDEN),

    // ===== USER / AUTH =====
    USER_NOT_FOUND("Người dùng không tồn tại", 1001, HttpStatus.NOT_FOUND),
    USERNAME_ALREADY_EXISTS("Tên đăng nhập đã tồn tại", 1002, HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTS("Email đã tồn tại", 1003, HttpStatus.BAD_REQUEST),
    PHONE_ALREADY_EXISTS("Số điện thoại đã tồn tại", 1004, HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND("Role không tồn tại", 1005, HttpStatus.NOT_FOUND),
    INVALID_PASSWORD("Mật khẩu không hợp lệ", 1006, HttpStatus.BAD_REQUEST),
    PASSWORD_MISMATCH("Mật khẩu xác nhận không khớp", 1007, HttpStatus.BAD_REQUEST),
    ACCOUNT_DISABLED("Tài khoản đã bị vô hiệu hóa", 1008, HttpStatus.FORBIDDEN),
    ACCOUNT_LOCKED("Tài khoản đã bị khóa", 1009, HttpStatus.FORBIDDEN),

    // ===== CATEGORY =====
    CATEGORY_NOT_FOUND("Danh mục không tồn tại", 2001, HttpStatus.NOT_FOUND),
    INVALID_CATEGORY("Danh mục không hợp lệ", 2002, HttpStatus.BAD_REQUEST),
    CATEGORY_ALREADY_EXISTS("Danh mục đã tồn tại", 2003, HttpStatus.BAD_REQUEST),

    // ===== PRODUCT =====
    PRODUCT_NOT_FOUND("Sản phẩm không tồn tại", 3001, HttpStatus.NOT_FOUND),
    PRODUCT_OUT_OF_STOCK("Sản phẩm đã hết hàng", 3002, HttpStatus.BAD_REQUEST),
    INVALID_PRODUCT_PRICE("Giá sản phẩm không hợp lệ", 3003, HttpStatus.BAD_REQUEST),
    INVALID_PRODUCT_QUANTITY("Số lượng sản phẩm không hợp lệ", 3004, HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_AVAILABLE("Sản phẩm không có sẵn", 3005, HttpStatus.BAD_REQUEST),

    // ===== PET =====
    PET_NOT_FOUND("Thú cưng không tồn tại", 3501, HttpStatus.NOT_FOUND),
    PET_ALREADY_SOLD("Thú cưng đã được bán", 3502, HttpStatus.BAD_REQUEST),
    INVALID_PET_PRICE("Giá thú cưng không hợp lệ", 3503, HttpStatus.BAD_REQUEST),
    INVALID_PET_AGE("Tuổi thú cưng không hợp lệ", 3504, HttpStatus.BAD_REQUEST),
    INVALID_PET_NAME("Tên thú cưng không hợp lệ", 3505, HttpStatus.BAD_REQUEST),
    INVALID_PET_SPECIES("Loài thú cưng không hợp lệ", 3506, HttpStatus.BAD_REQUEST),
    INVALID_PET_BREED("Giống thú cưng không hợp lệ", 3507, HttpStatus.BAD_REQUEST),
    INVALID_PET_GENDER("Giới tính thú cưng không hợp lệ", 3508, HttpStatus.BAD_REQUEST),
    INVALID_PET_VACCINATED_STATUS("Trạng thái tiêm chủng không hợp lệ", 3509, HttpStatus.BAD_REQUEST),
    INVALID_PET_BIRTH("Trạng thái tiêm chủng không hợp lệ", 3510, HttpStatus.BAD_REQUEST),

    // ===== INVENTORY =====
    INVENTORY_NOT_FOUND("Kho hàng không tồn tại", 4001, HttpStatus.NOT_FOUND),
    INVENTORY_INACTIVE("Kho hàng không hoạt động", 4002, HttpStatus.BAD_REQUEST),
    INSUFFICIENT_INVENTORY("Không đủ hàng trong kho", 4003, HttpStatus.BAD_REQUEST),
    INVENTORY_ALREADY_EXISTS("Kho hàng đã tồn tại cho sản phẩm", 4004, HttpStatus.BAD_REQUEST),

    // ===== CART =====
    CART_NOT_FOUND("Giỏ hàng không tồn tại", 5001, HttpStatus.NOT_FOUND),
    CART_ALREADY_EXISTS("Giỏ hàng đã tồn tại", 5002, HttpStatus.BAD_REQUEST),
    CART_EMPTY("Giỏ hàng đang trống", 5003, HttpStatus.BAD_REQUEST),

    // ===== CART ITEM =====
    CART_ITEM_PRODUCT_NOT_FOUND("Sản phẩm không tồn tại", 5104, HttpStatus.NOT_FOUND),
    CART_ITEM_OUT_OF_STOCK("Sản phẩm đã hết hàng", 5105, HttpStatus.BAD_REQUEST),
    CART_ITEM_QUANTITY_EXCEEDS_STOCK("Số lượng vượt quá tồn kho", 5106, HttpStatus.BAD_REQUEST),
    CART_ITEM_LIMIT_EXCEEDED("Số lượng sản phẩm vượt quá giới hạn cho phép", 5107, HttpStatus.BAD_REQUEST),
    CART_ITEM_ALREADY_REMOVED("Sản phẩm đã bị xóa khỏi giỏ hàng", 5108, HttpStatus.BAD_REQUEST),
    CART_ITEM_INVALID_PRODUCT_ID("ID sản phẩm không hợp lệ", 5109, HttpStatus.BAD_REQUEST),
    CART_ITEM_INVALID_CART_ID("ID giỏ hàng không hợp lệ", 5110, HttpStatus.BAD_REQUEST),

    // ===== INVOICE / ORDER =====
    INVOICE_NOT_FOUND("Hóa đơn không tồn tại", 6001, HttpStatus.NOT_FOUND),
    INVALID_INVOICE_STATUS("Trạng thái hóa đơn không hợp lệ", 6002, HttpStatus.BAD_REQUEST),
    INVOICE_ALREADY_PAID("Hóa đơn đã được thanh toán", 6003, HttpStatus.BAD_REQUEST),
    INVALID_INVOICE_DETAIL("Chi tiết hóa đơn không hợp lệ", 6004, HttpStatus.BAD_REQUEST),

    // ===== PURCHASE =====
    PURCHASE_NOT_FOUND("Phiếu nhập không tồn tại", 7001, HttpStatus.NOT_FOUND),
    PURCHASE_DETAIL_NOT_FOUND("Chi tiết phiếu nhập không tồn tại", 7002, HttpStatus.NOT_FOUND),
    DUPLICATE_PURCHASE_PRODUCT("Sản phẩm đã tồn tại trong phiếu nhập", 7003, HttpStatus.BAD_REQUEST),

    // ===== PROMOTION =====
    PROMOTION_NOT_FOUND("Khuyến mãi không tồn tại", 8001, HttpStatus.NOT_FOUND),
    PROMOTION_ALREADY_EXISTS("Mã khuyến mãi đã tồn tại", 8002, HttpStatus.BAD_REQUEST),
    PROMOTION_EXPIRED("Khuyến mãi đã hết hạn", 8003, HttpStatus.BAD_REQUEST),
    PROMOTION_NOT_STARTED("Khuyến mãi chưa bắt đầu", 8004, HttpStatus.BAD_REQUEST),
    PROMOTION_INACTIVE("Khuyến mãi không còn hoạt động", 8005, HttpStatus.BAD_REQUEST),
    PROMOTION_USAGE_LIMIT_REACHED("Khuyến mãi đã đạt giới hạn sử dụng", 8006, HttpStatus.BAD_REQUEST),
    PROMOTION_NOT_APPLICABLE("Khuyến mãi không áp dụng cho đơn hàng này", 8007, HttpStatus.BAD_REQUEST),
    INVALID_PROMOTION_VALUE("Giá trị khuyến mãi không hợp lệ", 8008, HttpStatus.BAD_REQUEST),
    INVALID_PROMOTION_DATE("Thời gian khuyến mãi không hợp lệ", 8009, HttpStatus.BAD_REQUEST);

    private final String message;
    private final int errorCode;
    private final HttpStatus httpStatus;
}