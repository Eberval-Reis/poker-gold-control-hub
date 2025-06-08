
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createBackingOffer } from '@/services/backing.service';
import type { BackingOffer } from '@/lib/backing-types';
import BackingOfferForm from '@/components/backing/BackingOfferForm';

const CreateBackingOffer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: Partial<BackingOffer>) => {
    try {
      setIsLoading(true);
      
      // Ensure required fields are present
      const offerData = {
        tournament_id: data.tournament_id!,
        player_name: data.player_name!,
        buy_in_amount: data.buy_in_amount!,
        tournament_date: data.tournament_date!,
        collective_financing: data.collective_financing || false,
        available_percentage: data.available_percentage!,
        markup_percentage: data.markup_percentage!,
        status: 'open' as const
      };
      
      await createBackingOffer(offerData);
      
      toast({
        title: 'Sucesso',
        description: 'Oferta de cavalagem criada com sucesso!'
      });
      
      navigate('/backing');
    } catch (error) {
      console.error('Error creating backing offer:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar oferta de cavalagem.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/backing');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar Oferta de Cavalagem</h1>
        <p className="text-muted-foreground">
          Ofereça ações do seu torneio para outros jogadores
        </p>
      </div>

      <BackingOfferForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CreateBackingOffer;
