"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumb?: string;
}

export function DashboardLayout({ children, breadcrumb }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-layout__sidebar">
        <Sidebar />
      </div>

      <div className="dashboard-layout__main">
        <TopNavBar breadcrumb={breadcrumb} />
        <main className="dashboard-layout__content">{children}</main>
      </div>

      <div className="dashboard-layout__mobile-nav">
        <MobileBottomNav />
      </div>
    </div>
  );
}
