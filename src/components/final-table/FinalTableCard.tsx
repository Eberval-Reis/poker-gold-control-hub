
import { FinalTablePerformance } from '@/services/final-table.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Trophy, DollarSign, MapPin, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FinalTableCardProps {
  performance: FinalTablePerformance;
}

const FinalTableCard = ({ performance }: FinalTableCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    console.log('Performance data in FinalTableCard:', performance);
    console.log('Tournament data:', performance.tournaments);
    console.log('Club data:', performance.tournaments?.clubs);
  }, [performance]);

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

  const handleImageLoad = () => {
    console.log('Image loaded successfully for performance:', performance.id);
    setImageLoading(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Error loading image for performance:', performance.id, 'URL:', performance.ft_photo_url);
    setImageError(true);
    setImageLoading(false);
    (e.target as HTMLImageElement).style.display = 'none';
  };

  const hasValidImage = performance.ft_photo_url && !imageError;

  // Extrair nome do torneio e clube de forma segura
  const tournamentName = performance.tournaments?.name || 'Torneio sem nome';
  const clubName = performance.tournaments?.clubs?.name || 'Clube não informado';
  const tournamentDate = performance.tournaments?.date || '';

  console.log('Extracted tournament name:', tournamentName);
  console.log('Extracted club name:', clubName);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Seção da foto da FT */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {hasValidImage ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-pulse text-gray-400">Carregando foto...</div>
                </div>
              )}
              <img
                src={performance.ft_photo_url}
                alt="Foto da Final Table"
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-400">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {performance.ft_photo_url ? 'Erro ao carregar foto' : 'Sem foto disponível'}
                </p>
              </div>
            </div>
          )}
          
          {/* Badge da posição */}
          <div className="absolute top-2 right-2">
            <Badge className={`${getPositionColor(performance.position)} text-white`}>
              {performance.position}º lugar
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Título do torneio */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
              {tournamentName}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              {clubName}
            </div>
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              <span>{formatDate(tournamentDate)}</span>
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
