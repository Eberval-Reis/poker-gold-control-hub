import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus, List, BarChart3, Users, Calendar, Receipt, TrendingUp, Trophy } from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
    },
    {
      title: "Cadastros",
      icon: Plus,
      items: [
        { title: "Clube", href: "/register-club" },
        { title: "Torneio", href: "/register-tournament" },
        { title: "Performance", href: "/register-tournament-performance" },
        { title: "Resultado Torneios", href: "/tournament-results" },
        { title: "Despesa", href: "/register-expense" },
      ],
    },
    {
      title: "Listagens",
      icon: List,
      items: [
        { title: "Clubes", href: "/clubs" },
        { title: "Torneios", href: "/tournaments" },
        { title: "Performances", href: "/tournament-performances" },
        { title: "Despesas", href: "/expenses" },
      ],
    },
    {
      title: "Relatórios",
      icon: BarChart3,
      href: "/report",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground">
          Menu
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navegue pelas opções do sistema.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex flex-col space-y-2">
          {menuItems.map((item, index) => (
            item.items ? (
              <div key={index} className="space-y-1">
                <div className="flex items-center space-x-2 px-4 py-2 font-medium">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                <div className="flex flex-col pl-4 space-y-1">
                  {item.items.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      onClick={() => navigate(subItem.href)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${location.pathname === subItem.href ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
                        }`}
                    >
                      <span>{subItem.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                key={index}
                onClick={() => navigate(item.href)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${location.pathname === item.href ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
                  }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </button>
            )
          ))}
        </div>
        <Separator className="my-4" />
        {session ? (
          <button
            onClick={() => signOut()}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            Sair
          </button>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
