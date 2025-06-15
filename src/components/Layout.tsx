import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import ErrorBoundary from "@/components/common/ErrorBoundary";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <ErrorBoundary>
            <main className="flex-1 overflow-auto bg-gray-50">
              {children}
            </main>
          </ErrorBoundary>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
