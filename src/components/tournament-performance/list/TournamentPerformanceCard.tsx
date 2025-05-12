
import { Edit, Trash2, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TournamentPerformance } from '@/lib/supabase';
import { calculateTotalInvested, calculateProfitLoss, calculateROI } from '@/components/tournament-performance/TournamentPerformanceFormSchema';

interface TournamentPerformanceCardProps {
  performance: TournamentPerformance;
  onDeleteClick: (id: string) => void;
}

const TournamentPerformanceCard = ({ performance, onDeleteClick }: TournamentPerformanceCardProps) => {
  const navigate = useNavigate();
  
  // Calculate financial metrics
  const totalInvested = calculateTotalInvested(
    performance.buyin_amount || 0,
    performance.rebuy_amount,
    performance.rebuy_quantity,
    performance.addon_enabled,
    performance.addon_amount
  );
  
  const prizeAmount = performance.prize_amount || 0;
  const profitLoss = calculateProfitLoss(prizeAmount, totalInvested);
  const roi = calculateROI(profitLoss, totalInvested);
  
  // Determine color based on profit/loss
  const resultColor = profitLoss >= 0 ? 'text-[#006400]' : 'text-[#8b0000]';

  return (
    <Card className="overflow-hidden">
      <div className="bg-[#d4af37]/10 p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold truncate">
              {performance.tournaments?.name || 'Torneio não especificado'}
            </h3>
            <p className="text-sm text-gray-500">
              {performance.tournaments?.clubs?.name || 'Clube não especificado'}
            </p>
          </div>
          {performance.itm_achieved && (
            <div className="flex items-center text-[#d4af37]">
              <Trophy className="h-5 w-5" />
              <span className="ml-1 font-medium">
                {performance.position}º
              </span>
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Investimento</p>
              <p className="font-medium">R$ {totalInvested.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Prêmio</p>
              <p className="font-medium">
                R$ {prizeAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="border-t pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500">Resultado</p>
                <p className={`font-medium ${resultColor}`}>
                  R$ {profitLoss.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ROI</p>
                <p className={`font-medium ${resultColor}`}>
                  {roi.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/register-tournament-performance/${performance.id}`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteClick(performance.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentPerformanceCard;
