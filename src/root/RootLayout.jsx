import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <main className="w-full h-screen flex flex-row relative">
      <Sidebar />
      <Outlet />
    </main>
  );
}

export default RootLayout;
