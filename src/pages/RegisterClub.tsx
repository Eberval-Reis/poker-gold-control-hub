
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Trophy, House, Phone, User, MapPin, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/components/ui/use-toast';

type FormData = {
  name: string;
  location: string;
  phone?: string;
  contactPerson?: string;
  reference?: string;
  addressLink?: string;
  observations?: string;
};

const RegisterClub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast({
      title: "Clube cadastrado com sucesso!",
      description: "Os dados foram salvos.",
    });
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-poker-gold hover:text-poker-gold/80"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-poker-text-dark">Cadastrar Clube</h1>
          </div>
          <p className="text-[#5a5a5a]">
            Informe os dados básicos e adicionais (opcionais)
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Data Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-poker-text-dark">Dados Básicos</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-poker-gold" />
                  Nome do Clube*
                </Label>
                <Input
                  {...register('name', { required: true })}
                  className={`${errors.name ? 'border-[#8b0000]' : ''}`}
                />
                {errors.name && (
                  <span className="text-sm text-[#8b0000]">Campo obrigatório</span>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <House className="h-4 w-4 text-poker-gold" />
                  Localização*
                </Label>
                <Input
                  {...register('location', { required: true })}
                  className={`${errors.location ? 'border-[#8b0000]' : ''}`}
                />
                {errors.location && (
                  <span className="text-sm text-[#8b0000]">Campo obrigatório</span>
                )}
              </div>
            </div>
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
              <div>
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-poker-gold" />
                  Telefone
                </Label>
                <Input
                  {...register('phone')}
                  placeholder="(00) 00000-0000"
                  className="border-[#a0a0a0]"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4 text-poker-gold" />
                  Pessoa de Contato
                </Label>
                <Input
                  {...register('contactPerson')}
                  className="border-[#a0a0a0]"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-poker-gold" />
                  Ponto de Referência
                </Label>
                <Input
                  {...register('reference')}
                  className="border-[#a0a0a0]"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-poker-gold" />
                  Link do Endereço
                </Label>
                <Input
                  type="url"
                  {...register('addressLink')}
                  className="border-[#a0a0a0]"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Observations Section */}
          <div>
            <Label>Observações</Label>
            <Textarea
              {...register('observations')}
              className="border-[#a0a0a0]"
              placeholder="Digite suas observações aqui..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-poker-gold hover:bg-poker-gold/90 text-white"
            >
              Salvar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1 border-poker-gold text-poker-gold hover:bg-poker-gold/10"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterClub;
