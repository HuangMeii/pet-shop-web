import { Link, useLocation } from "react-router-dom";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Trang chủ", href: "/admin/dashBoard" },
  { label: "Nhân viên", href: "/admin/staffs" },
  { label: "Khách hàng", href: "/admin/customers" },
  { label: "Nhà cung cấp", href: "/admin/suppliers" },
  { label: "Sản phẩm", href: "/admin/listProducts" },
  { label: "Thú cưng", href: "/admin/pets" },
  { label: "Phiếu nhập", href: "/admin/purchases" },
  { label: "Hóa đơn", href: "/admin/manageOrders" },
  { label: "Khuyến mãi", href: "/admin/promotions" },
  { label: "Danh mục", href: "/admin/manageProductCategory" },
  { label: "dịch vụ", href: "/admin/manageServices" },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
      <aside className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white flex flex-col z-50">

        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              📊
            </div>
            <div>
              <h1 className="font-bold text-lg">AdminPro</h1>
              <p className="text-xs text-indigo-300">Dashboard v2.0</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs text-indigo-400 uppercase tracking-wider mb-4 px-2">
            Menu chính
          </p>

          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.href);

              return (
                  <li key={item.href}>
                    <Link
                        to={item.href}
                        className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                                ? "bg-white/15 border-l-4 border-indigo-400 text-white"
                                : "text-indigo-200 hover:bg-white/10 hover:translate-x-1"
                        }`}
                    >
                      {item.label}
                    </Link>
                  </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-indigo-300">
                admin@example.com
              </p>
            </div>
            <button className="text-indigo-300 hover:text-white transition">
              ⎋
            </button>
          </div>
        </div>
      </aside>
  );
};

export default AdminSidebar;
