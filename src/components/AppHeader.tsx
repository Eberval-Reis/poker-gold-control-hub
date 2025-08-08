import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { logout } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AppHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate("/login");
    }
  };

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
          onClick={handleLogout}
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Sair"
        >
          <LogOut size={24} />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
