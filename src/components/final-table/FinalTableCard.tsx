
import { FinalTablePerformance } from '@/services/final-table.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Trophy, DollarSign, MapPin } from 'lucide-react';

interface FinalTableCardProps {
  performance: FinalTablePerformance;
}

const FinalTableCard = ({ performance }: FinalTableCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const getPositionColor = (position?: number) => {
    if (!position) return 'bg-gray-500';
    if (position === 1) return 'bg-yellow-500';
    if (position === 2) return 'bg-gray-400';
    if (position === 3) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Foto da FT */}
        {performance.ft_photo_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={performance.ft_photo_url}
              alt="Foto da Final Table"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute top-2 right-2">
              <Badge className={`${getPositionColor(performance.position)} text-white`}>
                {performance.position}º lugar
              </Badge>
            </div>
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Título do torneio */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
              {performance.tournaments?.name || 'Torneio sem nome'}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              {performance.tournaments?.clubs?.name || 'Clube não informado'}
            </div>
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              <span>{formatDate(performance.tournaments?.date || '')}</span>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gray-500" />
              <span>{performance.position}º lugar</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>Buy-in: R$ {performance.buyin_amount?.toFixed(2) || '0.00'}</span>
            </div>

            {performance.prize_amount && performance.prize_amount > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">
                  Prêmio: R$ {performance.prize_amount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Link da reportagem */}
          {performance.news_link && (
            <div className="pt-2 border-t">
              <a
                href={performance.news_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Ver reportagem
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalTableCard;
