
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
        className="border-poker-gold text-poker-gold hover:bg-poker-gold/10"
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-poker-gold text-white hover:bg-poker-gold/90"
      >
        {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
      </Button>
    </div>
  );
};

export default FormActions;
