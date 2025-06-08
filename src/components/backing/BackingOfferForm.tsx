
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tournament } from '@/lib/supabase';
import { BackingOffer } from '@/lib/backing-types';

const backingOfferSchema = z.object({
  tournament_id: z.string().min(1, 'Selecione um torneio'),
  player_name: z.string().min(1, 'Nome do jogador é obrigatório'),
  buy_in_amount: z.number().min(1, 'Buy-in deve ser maior que zero'),
  tournament_date: z.string().min(1, 'Data do torneio é obrigatória'),
  collective_financing: z.boolean().default(false),
  available_percentage: z.number().min(1).max(90, 'Máximo 90% disponível'),
  markup_percentage: z.number().min(1.2, 'Mark-up mínimo de 1.2x')
});

type BackingOfferFormData = z.infer<typeof backingOfferSchema>;

interface BackingOfferFormProps {
  tournaments: Tournament[];
  onSubmit: (data: Partial<BackingOffer>) => void;
  initialData?: BackingOffer;
  isLoading?: boolean;
}

const BackingOfferForm = ({ tournaments, onSubmit, initialData, isLoading }: BackingOfferFormProps) => {
  const form = useForm<BackingOfferFormData>({
    resolver: zodResolver(backingOfferSchema),
    defaultValues: {
      tournament_id: initialData?.tournament_id || '',
      player_name: initialData?.player_name || '',
      buy_in_amount: initialData?.buy_in_amount || 0,
      tournament_date: initialData?.tournament_date || '',
      collective_financing: initialData?.collective_financing || false,
      available_percentage: initialData?.available_percentage || 70,
      markup_percentage: initialData?.markup_percentage || 1.2
    }
  });

  const handleSubmit = (data: BackingOfferFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? 'Editar Oferta de Cavalagem' : 'Nova Oferta de Cavalagem'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tournament_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Torneio*</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o torneio" />
                        </SelectTrigger>
                        <SelectContent>
                          {tournaments.map((tournament) => (
                            <SelectItem key={tournament.id} value={tournament.id}>
                              {tournament.name}
                              {tournament.date && ` (${tournament.date})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="player_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Jogador*</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do jogador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buy_in_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy-in (R$)*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tournament_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Torneio*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="collective_financing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Financiamento Coletivo (Cavalagem)</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Permitir que múltiplos investidores comprem ações
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="available_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>% de Ação Disponível*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        max="90"
                        placeholder="70" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="markup_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mark-up Padrão*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        min="1.2"
                        placeholder="1.2" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 1.2)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : (initialData ? 'Atualizar' : 'Criar Oferta')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BackingOfferForm;
