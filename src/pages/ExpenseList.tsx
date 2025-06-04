import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Download, Receipt, MapPin, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { expenseService } from '@/services/expense.service';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ExpenseList = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const { data: expenses = [], isLoading, refetch } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getExpenses,
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await expenseService.deleteExpense(id);
      toast({
        title: "Despesa excluída com sucesso",
        description: "A despesa foi removida do sistema.",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir despesa",
        description: "Ocorreu um erro ao tentar excluir a despesa.",
      });
    }
  };

  const handleExportPDF = () => {
    alert('Exportação para PDF será implementada em breve!');
  };

  // Filter and sort expenses
  const filteredAndSortedExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.expense_type?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || expense.expense_type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount':
          return (b.amount || 0) - (a.amount || 0);
        case 'type':
          return (a.expense_type || '').localeCompare(b.expense_type || '');
        default:
          return 0;
      }
    });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getExpenseTypeColor = (type: string) => {
    const colors = {
      'alimentacao': 'bg-orange-100 text-orange-800',
      'transporte': 'bg-blue-100 text-blue-800',
      'hospedagem': 'bg-purple-100 text-purple-800',
      'entrada': 'bg-green-100 text-green-800',
      'outros': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.outros;
  };

  const getExpenseTypeLabel = (type: string) => {
    const labels = {
      'alimentacao': 'Alimentação',
      'transporte': 'Transporte',
      'hospedagem': 'Hospedagem',
      'entrada': 'Entrada',
      'outros': 'Outros'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const uniqueTypes = Array.from(new Set(expenses.map(e => e.expense_type).filter(Boolean)));

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-poker-text-dark">Despesas</h1>
            <p className="text-gray-600">Gerencie todas as suas despesas relacionadas ao poker</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="bg-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
            <Button
              onClick={() => navigate('/register-expense')}
              className="bg-[#d4af37] text-white hover:bg-[#d4af37]/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Despesa
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por descrição ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getExpenseTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Data (mais recente)</SelectItem>
                  <SelectItem value="amount">Valor (maior)</SelectItem>
                  <SelectItem value="type">Tipo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(expenses.reduce((total, expense) => total + (expense.amount || 0), 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                {expenses.length} despesa{expenses.length !== 1 ? 's' : ''} registrada{expenses.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesa Média</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {expenses.length > 0 
                  ? formatCurrency(expenses.reduce((total, expense) => total + (expense.amount || 0), 0) / expenses.length)
                  : formatCurrency(0)
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Por despesa registrada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tipo Mais Comum</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const typeCounts = expenses.reduce((acc, expense) => {
                    const type = expense.expense_type || 'outros';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  const mostCommonType = Object.entries(typeCounts)
                    .sort(([,a], [,b]) => b - a)[0]?.[0];
                  
                  return mostCommonType ? getExpenseTypeLabel(mostCommonType) : 'N/A';
                })()}
              </div>
              <p className="text-xs text-muted-foreground">
                Categoria com mais registros
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Despesas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedExpenses.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                {searchTerm || typeFilter !== 'all' 
                  ? 'Nenhuma despesa encontrada com os filtros aplicados.'
                  : 'Nenhuma despesa cadastrada ainda.'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Comprovante</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {formatDate(expense.date)}
                      </TableCell>
                      <TableCell>
                        {expense.description}
                      </TableCell>
                      <TableCell>
                        <Badge className={getExpenseTypeColor(expense.expense_type || 'outros')}>
                          {getExpenseTypeLabel(expense.expense_type || 'outros')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(expense.amount || 0)}
                      </TableCell>
                      <TableCell>
                        {expense.receipt_url ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(expense.receipt_url, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sem comprovante</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/register-expense/${expense.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. A despesa será removida permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteExpense(expense.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseList;
