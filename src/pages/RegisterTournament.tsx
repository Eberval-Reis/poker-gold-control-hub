
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Trophy, Calendar, Clock, Building, BarChart, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Campo obrigatório' }),
  club: z.string().min(1, { message: 'Campo obrigatório' }),
  date: z.date({
    required_error: 'Campo obrigatório',
  }),
  time: z.string().min(1, { message: 'Campo obrigatório' }),
  type: z.string().min(1, { message: 'Campo obrigatório' }),
  initialStack: z.string().optional(),
  blindStructure: z.string().optional(),
  prizes: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Mock data for clubs
const clubs = [
  { id: '1', name: 'Clube de Poker A' },
  { id: '2', name: 'Clube de Poker B' },
  { id: '3', name: 'Clube de Poker C' },
];

// Tournament types
const tournamentTypes = [
  'Freezeout',
  'Rebuy',
  'Deepstack',
  'Bounty',
  'Knockout',
  'Satellite',
  'Turbo',
];

const RegisterTournament = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      club: '',
      time: '',
      type: '',
      initialStack: '',
      blindStructure: '',
      prizes: '',
      notes: '',
    },
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const useStandardStructure = () => {
    form.setValue('blindStructure', '1: 25/50, 2: 50/100, 3: 75/150, 4: 100/200, 5: 150/300...');
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast({
      title: "Torneio cadastrado com sucesso!",
      description: "Os dados foram salvos.",
    });
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
              onClick={() => navigate('/')}
              className="text-poker-gold hover:text-poker-gold/80"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-poker-text-dark">Cadastrar Torneio</h1>
          </div>
          <p className="text-[#5a5a5a]">
            Preencha os detalhes do torneio
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-poker-text-dark">Informações Básicas</h2>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-poker-gold" />
                      Nome do Torneio*
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
                name="club"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-poker-gold" />
                      Clube/Sede*
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um clube" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clubs.map((club) => (
                          <SelectItem key={club.id} value={club.id}>
                            {club.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[#8b0000]" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-poker-gold" />
                        Data*
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-[#8b0000]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-poker-gold" />
                        Hora*
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          placeholder="HH:mm"
                        />
                      </FormControl>
                      <FormMessage className="text-[#8b0000]" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-poker-gold" />
                      Tipo de Torneio*
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tournamentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[#8b0000]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Tournament Structure */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-poker-text-dark">Estrutura do Torneio</h2>
              
              <FormField
                control={form.control}
                name="initialStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stack Inicial</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 20000"
                        {...field}
                        className="border-[#a0a0a0]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="blindStructure"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Níveis de Blinds</FormLabel>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={useStandardStructure}
                        className="h-8 text-xs border-poker-gold text-poker-gold hover:bg-poker-gold/10"
                      >
                        Usar Estrutura Padrão
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os níveis de blinds"
                        {...field}
                        className="border-[#a0a0a0]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-poker-text-dark">Detalhes Adicionais</h2>
              
              <FormField
                control={form.control}
                name="prizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-poker-gold" />
                      Prêmios
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição dos prêmios"
                        {...field}
                        className="border-[#a0a0a0]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-poker-gold" />
                      Observações
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informações extras sobre o torneio"
                        {...field}
                        className="border-[#a0a0a0]"
                      />
                    </FormControl>
                  </FormItem>
                )}
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
        </Form>
      </div>
    </div>
  );
};

export default RegisterTournament;
