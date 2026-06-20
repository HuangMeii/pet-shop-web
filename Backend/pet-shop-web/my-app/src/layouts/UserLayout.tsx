"use client";

import { Outlet } from "react-router-dom";
import UserHeader from "../components/UserHeader.tsx";
import UserFooter from "../components/UserFooter.tsx";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <UserFooter />
    </div>
  );
}
