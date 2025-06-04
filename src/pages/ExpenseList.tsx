import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, MoreHorizontal, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ExpenseList = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState<any[] | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [expenseToDelete, setExpenseToDelete] = useState<any | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:3000/expenses');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error("Could not fetch expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete) return;
  
    try {
      const response = await fetch(`http://localhost:3000/expenses/${expenseToDelete.id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      setExpenses(expenses ? expenses.filter(expense => expense.id !== expenseToDelete.id) : []);
      setExpenseToDelete(null);
    } catch (error) {
      console.error("Could not delete expense:", error);
    }
  };

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    
    return expenses.filter(expense => {
      const matchesType = !selectedType || expense.type === selectedType;
      const matchesDateRange = !dateRange?.from || !dateRange?.to || 
        (new Date(expense.date) >= dateRange.from && new Date(expense.date) <= dateRange.to);
      const matchesSearch = !searchTerm || 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesType && matchesDateRange && matchesSearch;
    });
  }, [expenses, selectedType, dateRange, searchTerm]);

  const expensesByType = useMemo(() => {
    if (!filteredExpenses) return {};
    
    return filteredExpenses.reduce((acc, expense) => {
      const type = expense.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(expense);
      return acc;
    }, {} as Record<string, typeof filteredExpenses>);
  }, [filteredExpenses]);

  const expenseTypes = useMemo(() => {
    if (!expenses) return [];
    return [...new Set(expenses.map(expense => expense.type))];
  }, [expenses]);

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />

      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-6 w-6 text-[#d4af37]" />
            <h1 className="text-2xl font-bold text-poker-text-dark">Lista de Despesas</h1>
          </div>
          <p className="text-gray-600">Visualize e gerencie suas despesas de poker</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <Card className="col-span-1 lg:col-span-1">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="type">Tipo de Despesa</Label>
                <Select onValueChange={(value) => setSelectedType(value === 'all' ? null : value)} defaultValue={selectedType || 'all'}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os Tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    {expenseTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Período</Label>
                <DatePicker
                  date={dateRange?.from}
                  onDateChange={(date) => setDateRange({ from: date, to: dateRange?.to })}
                  placeholder="Data Inicial"
                  className="mb-2"
                />
                <DatePicker
                  date={dateRange?.to}
                  onDateChange={(date) => setDateRange({ from: dateRange?.from, to: date })}
                  placeholder="Data Final"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-3">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Despesas</CardTitle>
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={() => navigate('/register-expense')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Despesa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {expenses === null ? (
                <p>Carregando despesas...</p>
              ) : filteredExpenses.length === 0 ? (
                <p>Nenhuma despesa encontrada.</p>
              ) : (
                <div className="grid gap-4">
                  {filteredExpenses?.map((expense) => (
                    <Card key={expense.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg">{expense.description}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {expense.type}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => navigate(`/register-expense/${expense.id}`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => setExpenseToDelete(expense)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <p className="text-right font-medium">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {expenses && Object.keys(expensesByType).length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Despesas por Tipo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(expensesByType).map(([type, typeExpenses]) => (
                <div key={type} className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-600 uppercase tracking-wide">
                    {type} ({typeExpenses.length})
                  </h4>
                  {typeExpenses.map((expense) => (
                    <Card key={expense.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium">{expense.description}</h5>
                            <p className="text-sm text-gray-500">
                              {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}
                            </p>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => navigate(`/register-expense/${expense.id}`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => setExpenseToDelete(expense)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!expenseToDelete} onOpenChange={(open) => {
        if (!open) setExpenseToDelete(null);
      }}>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Mostrar Alerta</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir a despesa permanentemente. Tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteExpense}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpenseList;
