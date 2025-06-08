
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createBackingOffer } from '@/services/backing.service';
import { getTournaments } from '@/services/tournament.service';
import { BackingOffer } from '@/lib/backing-types';
import { Tournament } from '@/lib/supabase';
import BackingOfferForm from '@/components/backing/BackingOfferForm';

const CreateBackingOffer = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const data = await getTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Error loading tournaments:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar torneios.',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (data: Partial<BackingOffer>) => {
    try {
      setIsLoading(true);
      await createBackingOffer(data);
      
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nova Oferta de Cavalagem</h1>
        <p className="text-muted-foreground">
          Crie uma nova oferta para vender ações do seu torneio
        </p>
      </div>

      <BackingOfferForm
        tournaments={tournaments}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CreateBackingOffer;
