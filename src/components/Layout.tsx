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
        <div className="h-screen flex w-full overflow-hidden relative font-sans">
          <div className="bg-grain" />
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col relative z-20">
            <AppHeader />
            <ErrorBoundary>
              <main className="flex-1 overflow-y-auto bg-background/95 dark:bg-background transition-colors animate-reveal">
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
