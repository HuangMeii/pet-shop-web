import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CartPage from "./pages/user/CartPage/CartPage";
import ProfilePage from "./pages/user/ProfilePage/ProfilePage";
import ProductsPage from "./pages/user/ProductsPage/ProductsPage";
import ServicesPage from "./pages/user/ServicesPage/ServicesPage";
import DetailedProductPage from "./pages/user/DetailedProductPage/DetailedProductPage";
import ReviewPage from "./pages/user/ReviewPage/ReviewPage";
import PetsPage from "./pages/user/PetsPage/PetsPage";
import PaidInvoicesPage from "./pages/user/PaidInvoicesPage/PaidInvoicesPage";
import InvoiceDetailPage from "./pages/user/PaidInvoicesPage/InvoiceDetailPage";
import ListProductsPage from "./pages/admin/ListProductsPage/ListProductsPage";
import ManageOrdersPage from "./pages/admin/ManageOrdersPage/ManageOrdersPage";
import ManageProductCategoryPage from "./pages/admin/ManageProductCategoryPage/ManageProductCategoryPage";
import ManageServicesPage from "./pages/admin/ManageServicesPage/ManageServicesPage";
import PurchasePage from "./pages/admin/PurchasePage/PurchasePage.tsx";
import AddPurchasePage from "./pages/admin/PurchasePage/AddPurchasePage.tsx";
import PromotionManagementPage from "./pages/admin/PromotionPage/PromotionManagementPage.tsx";
import AddPromotionPage from "./pages/admin/PromotionPage/AddPromotionPage.tsx";
import AdminDashBoard from "./pages/admin/DashBoardPage/AdminDashBoard";
import RegisterPage from "./pages/user/RegisterPage/RegisterPage";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/LoginPage/LoginPage";

import { AuthProvider } from "./context/authContext";

import "./App.css";
import StaffPage from "./pages/admin/StaffPage/StaffPage.tsx";
import CustomerPage from "./pages/admin/CustomerPage/CustomerPage.tsx";
import SupplierPage from "./pages/admin/SupplierPage/SupplierPage.tsx";
import ManagePetsPage from "./pages/admin/ManagePetsPage/ManagePetsPage.tsx";

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
                path="/"
                element={<Navigate to="/user/products" replace />}
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/register" element={<RegisterPage />} />


            <Route path="/user" element={<UserLayout />}>
              <Route path="cart" element={<CartPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="pets" element={<PetsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route
                  path="detailedProduct/:id"
                  element={<DetailedProductPage />}
              />
              <Route path="review" element={<ReviewPage />} />
              <Route path="invoices/:invoiceId" element={<InvoiceDetailPage />} />
              <Route path="invoices" element={<PaidInvoicesPage />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="" element={<AdminDashBoard />} />
              <Route path="dashBoard" element={<AdminDashBoard />} />
              <Route path="staffs" element={<StaffPage />} />
              <Route path="customers" element={<CustomerPage />} />
              <Route path="listProducts" element={<ListProductsPage />} />
              <Route path="manageOrders" element={<ManageOrdersPage />} />
              <Route path="suppliers" element={<SupplierPage />} />
              <Route path="pets" element={<ManagePetsPage />} />
              <Route
                  path="manageProductCategory"
                  element={<ManageProductCategoryPage />}
              />
              <Route
                  path="manageServices"
                  element={<ManageServicesPage />}
              />
              <Route path="purchases/add" element={<AddPurchasePage />} />
              <Route path="purchases" element={<PurchasePage />} />
              <Route path="promotions/add" element={<AddPromotionPage />} />
              <Route path="promotions" element={<PromotionManagementPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  );
};

export default App;
