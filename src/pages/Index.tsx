
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />
      
      <main className="flex justify-center items-center p-4">
        <div className="w-full max-w-3xl">
          <img 
            src="/lovable-uploads/77a82eaa-be06-4f0d-b570-77e7d2fee8c6.png"
            alt="Jogador de poker com cartas e fichas"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </main>
    </div>
  );
};

export default Index;

