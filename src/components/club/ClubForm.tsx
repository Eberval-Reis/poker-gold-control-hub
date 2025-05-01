
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { clubService } from '@/services/club.service';
import { clubFormSchema, ClubFormData } from './ClubFormSchema';
import BasicInformationSection from './BasicInformationSection';
import ContactsSection from './ContactsSection';
import ObservationsSection from './ObservationsSection';
import FormActions from '@/components/expense/FormActions';

interface ClubFormProps {
  clubId?: string;
  clubData?: any;
  isLoading?: boolean;
}

const ClubForm = ({ clubId, clubData, isLoading = false }: ClubFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const isEditing = Boolean(clubId);
  
  const form = useForm<ClubFormData>({
    resolver: zodResolver(clubFormSchema),
    defaultValues: {
      name: '',
      location: '',
      phone: '',
      contact_person: '',
      reference: '',
      address_link: '',
      observations: '',
    },
  });
  
  // Set form values when club data is available
  useEffect(() => {
    if (clubData) {
      form.reset({
        name: clubData.name || '',
        location: clubData.location || '',
        phone: clubData.phone || '',
        contact_person: clubData.contact_person || '',
        reference: clubData.reference || '',
        address_link: clubData.address_link || '',
        observations: clubData.observations || '',
      });
      
      // Expand additional section if any field is filled
      if (clubData.phone || clubData.contact_person || clubData.reference || clubData.address_link) {
        setIsOpen(true);
      }
    }
  }, [clubData, form]);
  
  // Create or update club mutation
  const mutation = useMutation({
    mutationFn: (data: ClubFormData) => {
      const formattedData = {
        name: data.name,
        location: data.location,
        phone: data.phone,
        contact_person: data.contact_person,
        reference: data.reference,
        address_link: data.address_link,
        observations: data.observations,
      };
      
      return isEditing
        ? clubService.updateClub(clubId as string, formattedData)
        : clubService.createClub(formattedData);
    },
    onSuccess: () => {
      toast({
        title: `Clube ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
        description: "Os dados foram salvos.",
      });
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      navigate('/clubs');
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} clube`,
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    },
  });
  
  const onSubmit = (data: ClubFormData) => {
    mutation.mutate(data);
  };

  const onCancel = () => {
    navigate('/clubs');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Data Section */}
        <BasicInformationSection form={form} />

        {/* Optional Section */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center gap-2 mb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-poker-gold">
                {isOpen ? '−' : '+'} Contatos & Referências
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="space-y-4">
            <ContactsSection form={form} />
          </CollapsibleContent>
        </Collapsible>

        {/* Observations Section */}
        <ObservationsSection form={form} />

        {/* Form Actions */}
        <FormActions 
          isSubmitting={mutation.isPending} 
          isEditing={isEditing} 
          onCancel={onCancel} 
        />
      </form>
    </Form>
  );
};

export default ClubForm;
