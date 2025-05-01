
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const FormActions = ({ isSubmitting, isEditing, onCancel }: FormActionsProps) => {
  return (
    <div className="flex gap-4 pt-4">
      <Button 
        type="submit" 
        className="bg-poker-gold hover:bg-poker-gold/90"
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? 'Salvando...' 
          : isEditing ? 'Atualizar' : 'Salvar'}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="border-poker-gold text-poker-gold hover:bg-poker-gold/10"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
    </div>
  );
};

export default FormActions;
