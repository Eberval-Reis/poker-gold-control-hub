
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackingOffer } from '@/lib/backing-types';

const backingOfferSchema = z.object({
  tournament_id: z.string().min(1, 'Torneio é obrigatório'),
  player_name: z.string().min(1, 'Nome do jogador é obrigatório'),
  buy_in_amount: z.number().min(0.01, 'Buy-in deve ser maior que 0'),
  tournament_date: z.string().min(1, 'Data do torneio é obrigatória'),
  collective_financing: z.boolean().default(false),
  available_percentage: z.number().min(1, 'Percentual deve ser pelo menos 1%').max(100, 'Percentual não pode exceder 100%'),
  markup_percentage: z.number().min(0, 'Markup não pode ser negativo').max(200, 'Markup muito alto'),
});

type BackingOfferFormData = z.infer<typeof backingOfferSchema>;

interface BackingOfferFormProps {
  onSubmit: (data: Partial<BackingOffer>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const BackingOfferForm: React.FC<BackingOfferFormProps> = ({ onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BackingOfferFormData>({
    resolver: zodResolver(backingOfferSchema),
    defaultValues: {
      collective_financing: false,
      available_percentage: 50,
      markup_percentage: 20,
    }
  });

  const watchCollectiveFinancing = watch('collective_financing');
  const watchBuyIn = watch('buy_in_amount');
  const watchMarkup = watch('markup_percentage');

  const handleFormSubmit = async (data: BackingOfferFormData) => {
    await onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes da Oferta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tournament_id">Torneio</Label>
              <Input
                id="tournament_id"
                {...register('tournament_id')}
                placeholder="ID do torneio"
              />
              {errors.tournament_id && (
                <p className="text-sm text-red-500 mt-1">{errors.tournament_id.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="player_name">Nome do Jogador</Label>
              <Input
                id="player_name"
                {...register('player_name')}
                placeholder="Seu nome"
              />
              {errors.player_name && (
                <p className="text-sm text-red-500 mt-1">{errors.player_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="buy_in_amount">Buy-in (R$)</Label>
              <Input
                id="buy_in_amount"
                type="number"
                step="0.01"
                {...register('buy_in_amount', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.buy_in_amount && (
                <p className="text-sm text-red-500 mt-1">{errors.buy_in_amount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="tournament_date">Data do Torneio</Label>
              <Input
                id="tournament_date"
                type="date"
                {...register('tournament_date')}
              />
              {errors.tournament_date && (
                <p className="text-sm text-red-500 mt-1">{errors.tournament_date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="available_percentage">Percentual Disponível (%)</Label>
              <Input
                id="available_percentage"
                type="number"
                min="1"
                max="100"
                {...register('available_percentage', { valueAsNumber: true })}
              />
              {errors.available_percentage && (
                <p className="text-sm text-red-500 mt-1">{errors.available_percentage.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="markup_percentage">Markup (%)</Label>
              <Input
                id="markup_percentage"
                type="number"
                min="0"
                max="200"
                step="0.1"
                {...register('markup_percentage', { valueAsNumber: true })}
              />
              {errors.markup_percentage && (
                <p className="text-sm text-red-500 mt-1">{errors.markup_percentage.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="collective_financing"
              checked={watchCollectiveFinancing}
              onCheckedChange={(checked) => setValue('collective_financing', checked)}
            />
            <Label htmlFor="collective_financing">Financiamento Coletivo</Label>
          </div>

          {watchBuyIn && watchMarkup !== undefined && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Resumo Financeiro</h4>
              <p>Buy-in: R$ {watchBuyIn.toFixed(2)}</p>
              <p>Markup: {watchMarkup}%</p>
              <p>Valor com markup: R$ {(watchBuyIn * (1 + watchMarkup / 100)).toFixed(2)}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Oferta'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BackingOfferForm;
