import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Trophy, House, Phone, User, MapPin, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { clubService } from '@/services/club.service';
import * as z from 'zod';

// Club form schema
const clubFormSchema = z.object({
  name: z.string().min(1, { message: 'Campo obrigatório' }),
  location: z.string().min(1, { message: 'Campo obrigatório' }),
  phone: z.string().optional(),
  contact_person: z.string().optional(),
  reference: z.string().optional(),
  address_link: z.string().url({ message: 'URL inválida' }).optional().or(z.literal('')),
  observations: z.string().optional(),
});

type ClubFormData = z.infer<typeof clubFormSchema>;

const RegisterClub = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isEditing = Boolean(id);
  
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
  
  // Get club data if editing
  const { isLoading: isLoadingClub } = useQuery({
    queryKey: ['club', id],
    queryFn: () => clubService.getClubById(id as string),
    enabled: !!id,
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          form.reset({
            name: data.name || '',
            location: data.location || '',
            phone: data.phone || '',
            contact_person: data.contact_person || '',
            reference: data.reference || '',
            address_link: data.address_link || '',
            observations: data.observations || '',
          });
          
          // Expand additional section if any field is filled
          if (data.phone || data.contact_person || data.reference || data.address_link) {
            setIsOpen(true);
          }
        }
      },
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados do clube",
          description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        });
        navigate('/clubs');
      }
    }
  });
  
  // Create or update club mutation
  const mutation = useMutation({
    mutationFn: (data: ClubFormData) => {
      const formattedData = {
        name: data.name, // Ensure required field
        location: data.location, // Ensure required field
        phone: data.phone,
        contact_person: data.contact_person,
        reference: data.reference,
        address_link: data.address_link,
        observations: data.observations,
      };
      
      return isEditing
        ? clubService.updateClub(id as string, formattedData)
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const onSubmit = (data: ClubFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />

      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
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
              {isEditing ? 'Editar Clube' : 'Cadastrar Clube'}
            </h1>
          </div>
          <p className="text-[#5a5a5a]">
            {isEditing 
              ? 'Atualize os dados do clube'
              : 'Informe os dados básicos e adicionais (opcionais)'}
          </p>
        </div>

        {isLoadingClub ? (
          <div className="flex justify-center items-center p-8">
            <p>Carregando...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Data Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-poker-text-dark">Dados Básicos</h2>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-poker-gold" />
                        Nome do Clube*
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-[#8b0000]" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <House className="h-4 w-4 text-poker-gold" />
                        Localização*
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-[#8b0000]" />
                    </FormItem>
                  )}
                />
              </div>

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
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-poker-gold" />
                          Telefone
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(00) 00000-0000"
                            className="border-[#a0a0a0]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contact_person"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4 text-poker-gold" />
                          Pessoa de Contato
                        </FormLabel>
                        <FormControl>
                          <Input className="border-[#a0a0a0]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-poker-gold" />
                          Ponto de Referência
                        </FormLabel>
                        <FormControl>
                          <Input className="border-[#a0a0a0]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Link className="h-4 w-4 text-poker-gold" />
                          Link do Endereço
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            className="border-[#a0a0a0]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Observations Section */}
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        className="border-[#a0a0a0]"
                        placeholder="Digite suas observações aqui..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-poker-gold hover:bg-poker-gold/90 text-white"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending 
                    ? 'Salvando...' 
                    : isEditing ? 'Atualizar' : 'Salvar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/clubs')}
                  className="flex-1 border-poker-gold text-poker-gold hover:bg-poker-gold/10"
                  disabled={mutation.isPending}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default RegisterClub;
