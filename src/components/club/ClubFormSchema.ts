
import * as z from 'zod';

// Club form schema
export const clubFormSchema = z.object({
  name: z.string().min(1, { message: 'Campo obrigatório' }),
  location: z.string().min(1, { message: 'Campo obrigatório' }),
  phone: z.string().optional(),
  contact_person: z.string().optional(),
  reference: z.string().optional(),
  address_link: z.string().url({ message: 'URL inválida' }).optional().or(z.literal('')),
  observations: z.string().optional(),
});

export type ClubFormData = z.infer<typeof clubFormSchema>;
