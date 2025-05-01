
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Phone, User, MapPin, Link } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ClubFormData } from './ClubFormSchema';

interface ContactsSectionProps {
  form: UseFormReturn<ClubFormData>;
}

const ContactsSection = ({ form }: ContactsSectionProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default ContactsSection;
