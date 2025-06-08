
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BackingOffer, BackingInvestment } from '@/lib/backing-types';
import { calculateInvestmentAmount, formatCurrency, formatPercentage } from '@/utils/backing-calculations';

const investmentSchema = z.object({
  backer_name: z.string().min(1, 'Nome do investidor é obrigatório'),
  percentage_bought: z.number().min(0.1, 'Mínimo 0.1%').max(100, 'Máximo 100%')
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

interface BackingInvestmentFormProps {
  offer: BackingOffer;
  existingInvestments: BackingInvestment[];
  onSubmit: (data: Partial<BackingInvestment>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const BackingInvestmentForm = ({ 
  offer, 
  existingInvestments, 
  onSubmit, 
  onCancel, 
  isLoading 
}: BackingInvestmentFormProps) => {
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  
  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      backer_name: '',
      percentage_bought: 1
    }
  });

  const percentageValue = form.watch('percentage_bought');
  const totalSoldPercentage = existingInvestments.reduce((sum, inv) => sum + inv.percentage_bought, 0);
  const remainingPercentage = offer.available_percentage - totalSoldPercentage;

  useEffect(() => {
    if (percentageValue) {
      const amount = calculateInvestmentAmount(
        offer.buy_in_amount,
        percentageValue,
        offer.markup_percentage
      );
      setCalculatedAmount(amount);
    }
  }, [percentageValue, offer.buy_in_amount, offer.markup_percentage]);

  const handleSubmit = (data: InvestmentFormData) => {
    const investmentData: Partial<BackingInvestment> = {
      backing_offer_id: offer.id,
      backer_name: data.backer_name,
      percentage_bought: data.percentage_bought,
      amount_paid: calculatedAmount,
      payment_status: 'pending'
    };
    
    onSubmit(investmentData);
  };

  const isPercentageValid = percentageValue <= remainingPercentage;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Investir em Ação</CardTitle>
        <div className="text-sm text-muted-foreground">
          <p><strong>Torneio:</strong> {offer.tournaments?.name}</p>
          <p><strong>Jogador:</strong> {offer.player_name}</p>
          <p><strong>Buy-in:</strong> {formatCurrency(offer.buy_in_amount)}</p>
          <p><strong>Mark-up:</strong> {offer.markup_percentage}x</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">% Disponível:</span>
              <p>{formatPercentage(offer.available_percentage)}</p>
            </div>
            <div>
              <span className="font-medium">% Já Vendida:</span>
              <p>{formatPercentage(totalSoldPercentage)}</p>
            </div>
            <div>
              <span className="font-medium">% Restante:</span>
              <p className="text-green-600 font-bold">
                {formatPercentage(remainingPercentage)}
              </p>
            </div>
            <div>
              <span className="font-medium">Investidores:</span>
              <p>{existingInvestments.length}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="backer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Investidor*</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="percentage_bought"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentual a Comprar (%)*</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      min="0.1"
                      max={remainingPercentage}
                      placeholder="1.0" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  {!isPercentageValid && (
                    <p className="text-sm text-red-600">
                      Máximo disponível: {formatPercentage(remainingPercentage)}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Valor a Pagar:</span>
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(calculatedAmount)}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Percentual:</span>
                  <p className="text-lg font-bold">
                    {formatPercentage(percentageValue || 0)}
                  </p>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Cálculo: ({formatCurrency(offer.buy_in_amount)} × {formatPercentage(percentageValue || 0)}) × {offer.markup_percentage}x
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isLoading || !isPercentageValid || remainingPercentage <= 0}
                className="flex-1"
              >
                {isLoading ? 'Processando...' : 'Confirmar Investimento'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BackingInvestmentForm;
