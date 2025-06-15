import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const AppHeader = () => {
  return (
    <header className="bg-white dark:bg-background border-b border-gray-200 dark:border-border p-4 flex justify-between items-center transition-colors">
      <div className="flex items-center gap-2">
        {/* Agora o trigger está sempre visível */}
        <SidebarTrigger className="mr-2" />
        <h1 className="text-xl font-bold">Poker Control</h1>
      </div>
      <div className="flex gap-1">
        <ThemeToggle />
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full hover:bg-gray-100"
        >
          <User size={24} />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
