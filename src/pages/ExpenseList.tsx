import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { expenseService } from '@/services/expense.service';
import { formatDateToBR } from "@/lib/utils";

const ExpenseList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getExpenses
  });

  const deleteMutation = useMutation({
    mutationFn: expenseService.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Sucesso",
        description: "Despesa excluída com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir despesa.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      deleteMutation.mutate(id);
    }
  };

  const expenseTypes = [
    { id: 'transport', name: 'Transporte' },
    { id: 'food', name: 'Alimentação' },
    { id: 'accommodation', name: 'Hospedagem' },
    { id: 'other', name: 'Outros' },
  ];

  const getExpenseTypeName = (typeId: string) => {
    return expenseTypes.find(type => type.id === typeId)?.name || typeId;
  };

  const filteredExpenses = Array.isArray(expenses) ? expenses.filter(expense =>
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getExpenseTypeName(expense.type).toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar despesas: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-[#d4af37]" />
          <h1 className="text-2xl font-bold text-poker-text-dark">Lista de Despesas</h1>
        </div>
        <p className="text-gray-600">Gerencie suas despesas relacionadas aos torneios</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar despesas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => navigate('/register-expense')}
          className="bg-poker-gold hover:bg-poker-gold/90 text-white shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Despesa
        </Button>
      </div>
      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando despesas...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredExpenses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">
                  {searchTerm ? 'Nenhuma despesa encontrada para sua busca.' : 'Nenhuma despesa cadastrada ainda.'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => navigate('/register-expense')}
                    className="mt-4 bg-poker-gold hover:bg-poker-gold/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar primeira despesa
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredExpenses.map((expense) => (
              <Card key={expense.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                  <CardTitle className="text-lg leading-none">
                    {getExpenseTypeName(expense.type)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/register-expense/${expense.id}`)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Valor</p>
                      <p className="text-lg font-semibold text-green-600">
                        R$ {Number(expense.amount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Data</p>
                      <p className="text-sm">{formatDateToBR(expense.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Torneio</p>
                      <p className="text-sm">
                        {expense.tournaments?.name || 'Não associado'}
                      </p>
                    </div>
                  </div>
                  {expense.description && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-600">Descrição</p>
                      <p className="text-sm text-gray-800">{expense.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
