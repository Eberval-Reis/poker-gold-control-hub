import * as z from 'zod';

export const tournamentFormSchema = z.object({
  name: z.string().min(1, { message: 'Campo obrigatório' }),
  club_id: z.string().min(1, { message: 'Campo obrigatório' }),
  type: z.string().min(1, { message: 'Campo obrigatório' }),
  initial_stack: z.string().optional(),
  blind_structure: z.string().optional(),
  buyin_amount: z.string().optional(),
  rebuy_amount: z.string().optional(),
  addon_amount: z.string().optional(),
  event_id: z.string().optional(),
});

export type TournamentFormData = z.infer<typeof tournamentFormSchema>;

// Tournament types
export const tournamentTypes = [
  'Freezeout',
  'Rebuy',
  'Deepstack',
  'Bounty',
  'Knockout',
  'Satellite',
  'Turbo',
];
