
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp, Users, DollarSign, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getBackingOffers, getBackingInvestments } from '@/services/backing.service';
import { getTournaments } from '@/services/tournament.service';
import { BackingOffer, BackingInvestment } from '@/lib/backing-types';
import { Tournament } from '@/lib/supabase';
import { formatCurrency, formatPercentage } from '@/utils/backing-calculations';
import BackingMarketplace from '@/components/backing/BackingMarketplace';

const BackingDashboard = () => {
  const [offers, setOffers] = useState<BackingOffer[]>([]);
  const [investments, setInvestments] = useState<BackingInvestment[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [offersData, investmentsData, tournamentsData] = await Promise.all([
        getBackingOffers(),
        getBackingInvestments(),
        getTournaments()
      ]);
      
      setOffers(offersData);
      setInvestments(investmentsData);
      setTournaments(tournamentsData);
    } catch (error) {
      console.error('Error loading backing data:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados de cavalagem.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvest = (offerId: string) => {
    navigate(`/backing/invest/${offerId}`);
  };

  // Calcular estatísticas
  const openOffers = offers.filter(o => o.status === 'open');
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount_paid, 0);
  const activeInvestors = new Set(investments.map(inv => inv.backer_name)).size;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Cavalagem</h1>
          <p className="text-muted-foreground">
            Gerencie ofertas de ações e investimentos em torneios
          </p>
        </div>
        <Button onClick={() => navigate('/backing/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Oferta
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ofertas Ativas</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openOffers.length}</div>
            <p className="text-xs text-muted-foreground">
              {offers.length} ofertas totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvestments)}</div>
            <p className="text-xs text-muted-foreground">
              {investments.length} investimentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investidores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInvestors}</div>
            <p className="text-xs text-muted-foreground">
              Backers únicos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="marketplace" className="space-y-6">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="my-offers">Minhas Ofertas</TabsTrigger>
          <TabsTrigger value="my-investments">Meus Investimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace">
          <BackingMarketplace 
            offers={openOffers} 
            onInvest={handleInvest}
          />
        </TabsContent>

        <TabsContent value="my-offers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {offer.tournaments?.name || 'Torneio não especificado'}
                    </CardTitle>
                    <Badge variant={offer.status === 'open' ? 'default' : 'secondary'}>
                      {offer.status === 'open' ? 'Aberto' : offer.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Jogador:</strong> {offer.player_name}</p>
                    <p><strong>Buy-in:</strong> {formatCurrency(offer.buy_in_amount)}</p>
                    <p><strong>% Disponível:</strong> {formatPercentage(offer.available_percentage)}</p>
                    <p><strong>Mark-up:</strong> {offer.markup_percentage}x</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => navigate(`/backing/offer/${offer.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-investments">
          <div className="space-y-4">
            {investments.map((investment) => (
              <Card key={investment.id}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="font-medium">{investment.backer_name}</p>
                      <p className="text-sm text-muted-foreground">Investidor</p>
                    </div>
                    <div>
                      <p className="font-medium">{formatPercentage(investment.percentage_bought)}</p>
                      <p className="text-sm text-muted-foreground">% Comprada</p>
                    </div>
                    <div>
                      <p className="font-medium">{formatCurrency(investment.amount_paid)}</p>
                      <p className="text-sm text-muted-foreground">Valor Pago</p>
                    </div>
                    <div>
                      <Badge variant={investment.payment_status === 'paid' ? 'default' : 'destructive'}>
                        {investment.payment_status === 'paid' ? 'Pago' : 
                         investment.payment_status === 'pending' ? 'Pendente' : 'Atrasado'}
                      </Badge>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Ver ROI
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackingDashboard;
