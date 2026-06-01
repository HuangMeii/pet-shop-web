# Luồng quản lý danh mục (Category Management Flow)

## 1. Mô tả chức năng

Cho phép admin CRUD danh mục sản phẩm.

## 2. Các trang/component liên quan

### Frontend
| File | Mô tả |
|------|-------|
| `src/pages/admin/ManageProductCategoryPage/ManageProductCategoryPage.tsx` | Quản lý danh mục |

### Backend
| File | Mô tả |
|------|-------|
| `controller/CategoryController.java` | REST controller category |
| `service/CategoryService.java` | Business logic category |
| `entity/Category.java` | Entity danh mục |

## 3. API Endpoints

```
GET /categories                         # Lấy tất cả danh mục
GET /categories/{id}                    # Lấy danh mục theo ID
POST /categories                        # Tạo danh mục mới
PUT /categories/{id}                    # Cập nhật danh mục
DELETE /categories/{id}                 # Xoá danh mục
```
