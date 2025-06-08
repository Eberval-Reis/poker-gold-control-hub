
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BackingOffer } from '@/lib/backing-types';
import { formatCurrency, formatPercentage } from '@/utils/backing-calculations';

interface BackingMarketplaceProps {
  offers: BackingOffer[];
  onInvest: (offerId: string) => void;
}

const BackingMarketplace = ({ offers, onInvest }: BackingMarketplaceProps) => {
  const [filters, setFilters] = useState({
    minBuyIn: '',
    maxMarkup: '',
    playerName: ''
  });

  const filteredOffers = offers.filter(offer => {
    if (offer.status !== 'open') return false;
    
    if (filters.minBuyIn && offer.buy_in_amount < parseFloat(filters.minBuyIn)) return false;
    if (filters.maxMarkup && offer.markup_percentage > parseFloat(filters.maxMarkup)) return false;
    if (filters.playerName && !offer.player_name.toLowerCase().includes(filters.playerName.toLowerCase())) return false;
    
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'closed': return 'bg-yellow-500';
      case 'finished': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'closed': return 'Fechado';
      case 'finished': return 'Finalizado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros do Marketplace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Buy-in Mínimo (R$)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={filters.minBuyIn}
                onChange={(e) => setFilters(prev => ({ ...prev, minBuyIn: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mark-up Máximo</label>
              <Input
                type="number"
                step="0.1"
                placeholder="2.0"
                value={filters.maxMarkup}
                onChange={(e) => setFilters(prev => ({ ...prev, maxMarkup: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nome do Jogador</label>
              <Input
                placeholder="Buscar jogador..."
                value={filters.playerName}
                onChange={(e) => setFilters(prev => ({ ...prev, playerName: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{offer.tournaments?.name || 'Torneio não especificado'}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {offer.tournaments?.clubs?.name || 'Clube não especificado'}
                  </p>
                </div>
                <Badge className={getStatusColor(offer.status)}>
                  {getStatusText(offer.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Jogador:</span>
                  <p>{offer.player_name}</p>
                </div>
                <div>
                  <span className="font-medium">Data:</span>
                  <p>{new Date(offer.tournament_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <span className="font-medium">Buy-in:</span>
                  <p>{formatCurrency(offer.buy_in_amount)}</p>
                </div>
                <div>
                  <span className="font-medium">Mark-up:</span>
                  <p>{offer.markup_percentage}x</p>
                </div>
                <div>
                  <span className="font-medium">% Disponível:</span>
                  <p>{formatPercentage(offer.available_percentage)}</p>
                </div>
                <div>
                  <span className="font-medium">Coletivo:</span>
                  <p>{offer.collective_financing ? 'Sim' : 'Não'}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Valor mínimo para {formatPercentage(1)}:
                </div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency((offer.buy_in_amount * 0.01) * offer.markup_percentage)}
                </div>
              </div>

              <Button 
                onClick={() => onInvest(offer.id)} 
                className="w-full"
                disabled={offer.status !== 'open'}
              >
                Investir
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhuma oferta encontrada com os filtros aplicados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BackingMarketplace;
