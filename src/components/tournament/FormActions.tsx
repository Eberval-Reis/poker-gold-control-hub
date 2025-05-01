
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isEditing: boolean;
  isPending: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isEditing, isPending, onCancel }) => {
  return (
    <div className="flex gap-4 pt-4">
      <Button
        type="submit"
        className="flex-1 bg-poker-gold hover:bg-poker-gold/90 text-white"
        disabled={isPending}
      >
        {isPending 
          ? 'Salvando...' 
          : isEditing ? 'Atualizar' : 'Salvar'}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="flex-1 border-poker-gold text-poker-gold hover:bg-poker-gold/10"
        disabled={isPending}
      >
        Cancelar
      </Button>
    </div>
  );
};

export default FormActions;
