
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, Club, Calendar, FileText, FileMinus, FilePlus } from 'lucide-react';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'Home', icon: Home },
  { name: 'Clube', icon: Club },
  { name: 'Torneio', icon: Calendar },
  { name: 'Cadastro das Despesas', icon: FileText },
  { name: 'Movimento Torneio', icon: FilePlus },
  { name: 'Movimento Despesas', icon: FileMinus },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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
            >
              <item.icon size={20} className="text-poker-gold" />
              <span>{item.name}</span>
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
