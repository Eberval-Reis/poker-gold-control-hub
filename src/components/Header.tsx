
import React from 'react';
import { Menu, User } from 'lucide-react';
import { Button } from "@/components/ui/button";

type HeaderProps = {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuClick}
          className="text-poker-gold hover:text-poker-gold hover:bg-gray-100"
        >
          <Menu size={24} />
        </Button>
        <h1 className="text-xl font-bold">Poker Control</h1>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        className="rounded-full text-poker-gold hover:text-poker-gold hover:bg-gray-100"
      >
        <User size={24} />
      </Button>
    </header>
  );
};

export default Header;
