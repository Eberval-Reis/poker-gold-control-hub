import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="h-screen flex w-full overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <AppHeader />
            <ErrorBoundary>
              <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-background transition-colors">
                {children}
              </main>
            </ErrorBoundary>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Layout;
