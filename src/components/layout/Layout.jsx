import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { cn } from "../../lib/utils";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neonBlue/10 via-darkBg to-darkBg pointer-events-none" />
        <div className="relative z-10 w-full h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
