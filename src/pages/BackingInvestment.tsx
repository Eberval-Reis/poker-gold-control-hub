
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getBackingOfferById, getBackingInvestments, createBackingInvestment } from '@/services/backing.service';
import { BackingOffer } from '@/lib/backing-types';
import type { BackingInvestment as BackingInvestmentType } from '@/lib/backing-types';
import BackingInvestmentForm from '@/components/backing/BackingInvestmentForm';

const BackingInvestment = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const [offer, setOffer] = useState<BackingOffer | null>(null);
  const [investments, setInvestments] = useState<BackingInvestmentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (offerId) {
      loadOfferData();
    }
  }, [offerId]);

  const loadOfferData = async () => {
    if (!offerId) return;
    
    try {
      const [offerData, investmentsData] = await Promise.all([
        getBackingOfferById(offerId),
        getBackingInvestments(offerId)
      ]);
      
      setOffer(offerData);
      setInvestments(investmentsData);
    } catch (error) {
      console.error('Error loading offer data:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados da oferta.',
        variant: 'destructive'
      });
      navigate('/backing');
    }
  };

  const handleSubmit = async (data: Partial<BackingInvestmentType>) => {
    try {
      setIsLoading(true);
      
      // Ensure required fields are present
      const investmentData = {
        backing_offer_id: offerId!,
        backer_name: data.backer_name!,
        percentage_bought: data.percentage_bought!,
        amount_paid: data.amount_paid!,
        payment_status: data.payment_status || 'pending'
      };
      
      await createBackingInvestment(investmentData);
      
      toast({
        title: 'Sucesso',
        description: 'Investimento realizado com sucesso!'
      });
      
      navigate('/backing');
    } catch (error) {
      console.error('Error creating investment:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao realizar investimento. Verifique se ainda há percentual disponível.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/backing');
  };

  if (!offer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Investir em Ação</h1>
        <p className="text-muted-foreground">
          Compre uma porcentagem da ação deste torneio
        </p>
      </div>

      <BackingInvestmentForm
        offer={offer}
        existingInvestments={investments}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BackingInvestment;
