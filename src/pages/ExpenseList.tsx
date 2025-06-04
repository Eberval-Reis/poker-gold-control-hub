
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Wallet, Plus, Pencil, Trash2, Search, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { expenseService } from '@/services/expense.service';
import { expenseTypes } from '@/components/expense/ExpenseFormSchema';
import { Expense } from '@/lib/supabase';

const ExpenseList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch expenses
  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getExpenses,
  });
  
  // Delete expense mutation
  const deleteExpense = useMutation({
    mutationFn: (id: string) => expenseService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Despesa removida com sucesso!",
        description: "Os dados foram excluídos.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao remover despesa",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    },
  });
  
  // Filter expenses based on search term
  const filteredExpenses = expenses.filter((expense: any) => {
    const searchLower = searchTerm.toLowerCase();
    const expenseType = expenseTypes.find(t => t.id === expense.type)?.name || '';
    
    return expenseType.toLowerCase().includes(searchLower) ||
           expense.description?.toLowerCase().includes(searchLower) ||
           expense.tournaments?.name?.toLowerCase().includes(searchLower) ||
           `${expense.amount}`.includes(searchLower);
  });
  
  const handleDelete = (id: string) => {
    deleteExpense.mutate(id);
  };
  
  const getExpenseTypeIcon = (typeId: string) => {
    const foundType = expenseTypes.find(t => t.id === typeId);
    if (!foundType) return <FileText className="h-4 w-4" />;
    
    switch (foundType.icon) {
      case 'car':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.2-.9-1.9-.9H5c-.7 0-1.5.3-2 .8L.9 9.7c-.3.4-.3 1 .1 1.3.4.3.9.3 1.2-.1l2.1-2c.4-.3.8-.5 1.2-.5h4.2c.5 0 .9.2 1.2.5.4.4.7.8 1.1 1.3"/><path d="M10.3 11H5c-1.1 0-2 .9-2 2v3c0 .6.4 1 1 1h1"/><circle cx="7" cy="17" r="2"/><path d="M16 17h-5"/><circle cx="18" cy="17" r="2"/></svg>;
      case 'utensils':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2l-8 4v9a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2z"/></svg>;
      case 'hotel':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hotel"><path d="M20 9.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3.5"/><path d="M2 13h5v8h10v-8h5"/><path d="M2 13h20"/></svg>;
      case 'clipboard':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>;
      case 'file-text':
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };
  
  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-poker-gold hover:text-poker-gold/80"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-poker-text-dark">Despesas</h1>
          </div>
          <p className="text-[#5a5a5a]">
            Gerencie seus gastos com torneios e jogos
          </p>
        </div>
        
        {/* Actions Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por tipo ou descrição..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Add New Button */}
          <Button
            className="bg-poker-gold hover:bg-poker-gold/90 text-poker-text-light gap-2 w-full md:w-auto"
            onClick={() => navigate('/register-expense')}
          >
            <Plus size={18} />
            Nova Despesa
          </Button>
        </div>
        
        {/* Expense List */}
        {isLoading ? (
          <div className="flex justify-center p-8">
            <p>Carregando despesas...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center p-8">
            <p className="text-red-500">Erro ao carregar despesas</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <Wallet className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">Nenhuma despesa encontrada</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm 
                ? "Nenhuma despesa corresponde à sua busca. Tente outros termos." 
                : "Você ainda não tem nenhuma despesa cadastrada."}
            </p>
            {!searchTerm && (
              <Button 
                className="mt-4 bg-poker-gold hover:bg-poker-gold/90"
                onClick={() => navigate('/register-expense')}
              >
                Cadastrar Despesa
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Torneio</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense: any) => {
                  const expenseType = expenseTypes.find(t => t.id === expense.type);
                  
                  return (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-poker-gold/10 p-1 text-poker-gold">
                            {getExpenseTypeIcon(expense.type)}
                          </div>
                          <span>{expenseType?.name || 'Outro'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{format(new Date(expense.date), 'dd/MM/yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell>{expense.tournaments?.name || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {expense.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-blue-600"
                            onClick={() => navigate(`/register-expense/${expense.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta despesa de {expenseType?.name || 'Outro'} no valor de {formatCurrency(expense.amount)}?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600"
                                  onClick={() => handleDelete(expense.id)}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
