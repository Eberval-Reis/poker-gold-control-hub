
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ExpenseForm from '@/components/expense/ExpenseForm';

const RegisterExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-poker-gold hover:text-poker-gold hover:bg-muted"
            onClick={() => navigate('/expenses')}
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-bold">
            {id ? 'Editar Despesa' : 'Cadastrar Despesa'}
          </h1>
        </div>
      </div>

      <Card className="mx-auto">
        <CardContent className="pt-6">
          <ExpenseForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterExpense;
