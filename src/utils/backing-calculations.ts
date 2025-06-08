
import { BackingInvestment, BackingCalculation } from '@/lib/backing-types';

export const calculateBackingResults = (
  buyInAmount: number,
  markupPercentage: number,
  prizeAmount: number,
  investments: BackingInvestment[]
): BackingCalculation => {
  // Calcular totais dos investimentos
  const totalPercentageSold = investments.reduce((sum, inv) => sum + inv.percentage_bought, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount_paid, 0);
  const playerPercentage = 100 - totalPercentageSold;
  
  // Calcular prêmio líquido
  const markupCost = buyInAmount * markupPercentage;
  const netPrize = Math.max(0, prizeAmount - markupCost);
  
  // Calcular lucro do jogador
  const playerProfit = (playerPercentage / 100) * netPrize;
  
  // Calcular pagamentos dos backers
  const backerPayouts = investments.map(investment => {
    const backerPayout = (investment.percentage_bought / 100) * netPrize;
    const roi = investment.amount_paid > 0 
      ? ((backerPayout - investment.amount_paid) / investment.amount_paid) * 100 
      : 0;
    
    return {
      backerId: investment.id,
      backerName: investment.backer_name,
      investmentAmount: investment.amount_paid,
      payout: backerPayout,
      roi: roi
    };
  });
  
  return {
    totalInvested,
    totalPercentageSold,
    playerPercentage,
    prizeAmount,
    netPrize,
    playerProfit,
    backerPayouts
  };
};

export const calculateInvestmentAmount = (
  buyInAmount: number,
  percentage: number,
  markupPercentage: number
): number => {
  return (buyInAmount * (percentage / 100)) * markupPercentage;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

export const formatROI = (roi: number): string => {
  const sign = roi >= 0 ? '+' : '';
  return `${sign}${roi.toFixed(1)}%`;
};
