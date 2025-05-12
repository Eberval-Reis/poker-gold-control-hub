
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const FormActions = ({ isSubmitting, isEditing, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10"
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#d4af37] text-white hover:bg-[#d4af37]/90"
      >
        {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
      </Button>
    </div>
  );
};

export default FormActions;
