
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tournaments', icon: Calendar, label: 'Torneios' },
    { path: '/schedule', icon: Calendar, label: 'Agenda' },
    { path: '/clubs', icon: Building2, label: 'Clubes' },
    { path: '/tournament-performances', icon: Trophy, label: 'Performances' },
    { path: '/expenses', icon: CreditCard, label: 'Despesas' },
    { path: '/final-tables', icon: Users, label: 'Final Tables' },
    { path: '/backing-management', icon: DollarSign, label: 'Gestão Cavalagem' },
    { path: '/report', icon: FileText, label: 'Relatórios' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Menu</h1>
        {/* Trigger SEM ícone manual, ele já inclui o ícone e comportamento */}
        <SidebarTrigger className="ml-2" aria-label="Colapsar/Expandir Menu" />
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
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path} className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
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
