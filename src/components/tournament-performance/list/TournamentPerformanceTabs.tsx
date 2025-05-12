
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TournamentPerformance } from '@/lib/supabase';
import TournamentPerformanceGrid from './TournamentPerformanceGrid';

interface TournamentPerformanceTabsProps {
  performances: TournamentPerformance[];
  isLoading: boolean;
  onDeleteClick: (id: string) => void;
}

const TournamentPerformanceTabs = ({
  performances,
  isLoading,
  onDeleteClick
}: TournamentPerformanceTabsProps) => {
  const [filter, setFilter] = useState<'all' | 'profit' | 'loss'>('all');
  
  // Filtered performances based on selected tab
  const filteredPerformances = performances.filter((performance) => {
    if (filter === 'all') return true;
    
    const buyinAmount = performance.buyin_amount || 0;
    const rebuyAmount = performance.rebuy_amount || 0;
    const rebuyQuantity = performance.rebuy_quantity || 0;
    const addonAmount = performance.addon_enabled ? (performance.addon_amount || 0) : 0;
    const prizeAmount = performance.prize_amount || 0;
    
    const totalInvested = buyinAmount + (rebuyAmount * rebuyQuantity) + addonAmount;
    const profitLoss = prizeAmount - totalInvested;
    
    return filter === 'profit' ? profitLoss >= 0 : profitLoss < 0;
  });

  return (
    <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
      <TabsList className="mb-6">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="profit">Lucro</TabsTrigger>
        <TabsTrigger value="loss">Prejuízo</TabsTrigger>
      </TabsList>

      <TabsContent value={filter}>
        <TournamentPerformanceGrid 
          performances={filteredPerformances} 
          isLoading={isLoading} 
          onDeleteClick={onDeleteClick}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TournamentPerformanceTabs;
