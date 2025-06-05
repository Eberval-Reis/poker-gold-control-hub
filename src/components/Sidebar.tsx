
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Trophy, Receipt, BarChart3, FileText } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const menuItems = [
    {
      title: "Home",
      icon: Home,
      href: "/",
    },
    {
      title: "Clube",
      icon: Users,
      href: "/clubs",
    },
    {
      title: "Torneio",
      icon: Trophy,
      href: "/tournaments",
    },
    {
      title: "Cadastro das Despesas",
      icon: Receipt,
      href: "/register-expense",
    },
    {
      title: "Movimento Torneio",
      icon: BarChart3,
      href: "/tournament-performances",
    },
    {
      title: "Movimento Despesas",
      icon: FileText,
      href: "/expenses",
    },
  ];

  if (isOpen !== undefined) {
    // Controlled sidebar (used with isOpen prop)
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-full sm:w-64">
          <SheetHeader>
            <SheetTitle className="text-[#d4af37]">Menu</SheetTitle>
            <SheetDescription>
              Navegue pelas opções do sistema.
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          <div className="flex flex-col space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.href);
                  onClose?.();
                }}
                className={`flex items-center justify-start space-x-3 px-3 py-3 rounded-md text-left hover:bg-secondary hover:text-secondary-foreground transition-colors w-full ${
                  location.pathname === item.href ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-5 w-5 text-[#d4af37] flex-shrink-0" />
                <span className="text-sm font-medium leading-none">{item.title}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Uncontrolled sidebar (original behavior)
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground">
          Menu
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-64">
        <SheetHeader>
          <SheetTitle className="text-[#d4af37]">Menu</SheetTitle>
          <SheetDescription>
            Navegue pelas opções do sistema.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex flex-col space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.href)}
              className={`flex items-center justify-start space-x-3 px-3 py-3 rounded-md text-left hover:bg-secondary hover:text-secondary-foreground transition-colors w-full ${
                location.pathname === item.href ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5 text-[#d4af37] flex-shrink-0" />
              <span className="text-sm font-medium leading-none">{item.title}</span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
