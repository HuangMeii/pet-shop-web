# Luồng khuyến mãi (Promotion Flow)

## 1. Mô tả chức năng

Cho phép admin tạo, sửa, xoá chương trình khuyến mãi và áp dụng cho sản phẩm.

## 2. Các trang/component liên quan

### Frontend
| File | Mô tả |
|------|-------|
| `src/pages/admin/PromotionManagementPage/PromotionManagementPage.tsx` | Quản lý khuyến mãi |
| `src/pages/admin/AddPromotionPage/AddPromotionPage.tsx` | Thêm khuyến mãi |

### Backend
| File | Mô tả |
|------|-------|
| `controller/PromotionController.java` | REST controller promotion |
| `service/PromotionService.java` | Business logic promotion |
| `entity/Promotion.java` | Entity khuyến mãi |
| `entity/PromotionDetail.java` | Entity chi tiết khuyến mãi |

## 3. API Endpoints

```
GET /promotions                         # Lấy tất cả khuyến mãi
GET /promotions/{id}                    # Lấy khuyến mãi theo ID
POST /promotions                        # Tạo khuyến mãi mới
PUT /promotions/{id}                    # Cập nhật khuyến mãi
DELETE /promotions/{id}                 # Xoá khuyến mãi
```

## 4. Luồng xử lý

1. Admin vào trang `/admin/promotions`, click "Thêm khuyến mãi"
2. Nhập thông tin: tên, mô tả, % giảm giá, ngày bắt đầu/kết thúc
3. Chọn sản phẩm áp dụng khuyến mãi
4. Gọi `POST /promotions` → Backend tạo Promotion + PromotionDetail
5. Khi user xem sản phẩm, giá sẽ được tính với discount
