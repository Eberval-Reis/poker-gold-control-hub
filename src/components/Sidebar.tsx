
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Building2, Trophy, FileText, Wallet, BarChart3 } from 'lucide-react';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Clubes', icon: Building2, path: '/clubs' },
  { name: 'Torneios', icon: Trophy, path: '/tournaments' },
  { name: 'Despesas', icon: Wallet, path: '/expenses' },
  { name: 'Cadastrar Clube', icon: Building2, path: '/register-club' },
  { name: 'Cadastrar Torneio', icon: Trophy, path: '/register-tournament' },
  { name: 'Cadastrar Despesa', icon: FileText, path: '/register-expense' },
  { name: 'Relatórios', icon: BarChart3, path: '/report' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-poker-gold">Menu</h2>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className="w-full justify-start menu-item text-poker-text-dark"
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon size={20} className="text-poker-gold mr-2" />
              <span>{item.name}</span>
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
