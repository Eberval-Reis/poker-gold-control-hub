
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Home,
  Trophy,
  Users,
  DollarSign,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  const menuItems = [
    // Visão geral
    { path: '/', icon: Home, label: 'Dashboard' },
    // Planejamento
    { path: '/schedule', icon: Calendar, label: 'Agenda' },
    { path: '/tournaments', icon: Trophy, label: 'Torneios' },
    { path: '/clubs', icon: Building2, label: 'Clubes' },
    // Registro de atividade
    { path: '/tournament-performances', icon: BarChart3, label: 'Performances' },
    { path: '/final-tables', icon: Users, label: 'Final Tables' },
    // Financeiro
    { path: '/expenses', icon: CreditCard, label: 'Despesas' },
    { path: '/backing-management', icon: DollarSign, label: 'Gestão Cavalagem' },
    // Análise
    { path: '/report', icon: FileText, label: 'Relatórios' },
  ];

  // Handler para fechar o menu mobile após o clique (se for mobile)
  const handleMenuClick = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (location.pathname !== path) {
      navigate(path);
    }
    // Fecha o menu se for mobile
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-poker-gold animate-pulse" />
          <h1 className="text-lg font-black font-montserrat uppercase tracking-tighter text-sidebar-foreground">
            Hub<span className="text-poker-gold text-xl">.</span>Admin
          </h1>
        </div>
        <SidebarTrigger className="text-sidebar-foreground/50 hover:text-poker-gold transition-colors" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                    // Adiciona onClick customizado ao Link do menu
                    >
                      <a
                        href={item.path}
                        onClick={handleMenuClick(item.path)}
                        className="flex items-center gap-3"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
