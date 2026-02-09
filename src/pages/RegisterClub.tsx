
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import ClubForm from '@/components/club/ClubForm';
import { clubService } from '@/services/club.service';

const RegisterClub = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: clubData, isLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: () => (id ? clubService.getClubById(id) : null),
    enabled: !!id,
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/clubs')}
            className="text-poker-gold hover:text-poker-gold/80"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-poker-text-dark">
            {id ? 'Editar Clube' : 'Cadastrar Clube'}
          </h1>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm mx-auto max-w-2xl">
        <ClubForm
          clubId={id}
          clubData={clubData as any}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default RegisterClub;
