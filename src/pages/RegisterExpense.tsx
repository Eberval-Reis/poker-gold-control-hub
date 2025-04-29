
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ExpenseForm from '@/components/expense/ExpenseForm';

const RegisterExpense = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-poker-background flex flex-col">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="container mx-auto py-6 px-4 flex-1">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-poker-gold hover:text-poker-gold hover:bg-gray-100"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-2xl font-bold">Cadastrar Despesa</h1>
          </div>
          <p className="text-[#5a5a5a]">
            Registre gastos com torneios, viagens ou outros
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <ExpenseForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterExpense;
