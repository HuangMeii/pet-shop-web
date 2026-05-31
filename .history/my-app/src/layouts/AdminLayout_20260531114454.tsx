import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/AdminSideBar.tsx";

const AdminLayout = () => {
  return (
      <div className="relative">
        {/* Sidebar cố định */}
        <AdminSideBar />

        {/* Content */}
        <div className="ml-64 min-h-screen bg-slate-100">
          <main className="">
            <Outlet />
          </main>
        </div>
      </div>
  );
};

export default AdminLayout;
