import React, { useState, useEffect } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { logout } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AppHeader = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
    });
  }, []);

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

  // Avatar: initial letter of email
  const avatarLetter = userEmail ? userEmail[0].toUpperCase() : "?";

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/40 p-2 sm:p-4 flex justify-between items-center transition-all sticky top-0 z-30">
      <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
        <SidebarTrigger className="mr-0.5 sm:mr-2 hover:text-poker-gold transition-colors flex-shrink-0 scale-90 sm:scale-100" />
        <h1 className="text-sm sm:text-xl font-montserrat tracking-tight text-foreground whitespace-nowrap">
          <span className="font-extrabold uppercase">Poker</span><span className="text-poker-gold font-light uppercase tracking-widest text-[0.85em] sm:text-[0.85em]">CONTROL</span>
        </h1>
      </div>

      <div className="flex gap-1 sm:gap-2 flex-shrink-0 items-center">
        {/* User email + avatar */}
        {userEmail && (
          <div className="hidden sm:flex items-center gap-2 mr-1">
            <div
              className="h-7 w-7 rounded-full bg-poker-gold/20 border border-poker-gold/40 flex items-center justify-center text-poker-gold text-xs font-bold select-none flex-shrink-0"
              title={userEmail}
            >
              {avatarLetter}
            </div>
            <span className="text-xs text-muted-foreground max-w-[140px] truncate" title={userEmail}>
              {userEmail}
            </span>
          </div>
        )}

        <ThemeToggle />

        {/* Logout with confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors h-8 w-8 sm:h-10 sm:w-10"
              title="Sair"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar saída</AlertDialogTitle>
              <AlertDialogDescription>
                Deseja realmente sair do sistema? Você precisará fazer login novamente para continuar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sair
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
};

export default AppHeader;
