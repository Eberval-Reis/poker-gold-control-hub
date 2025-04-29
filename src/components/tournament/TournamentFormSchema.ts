
import * as z from 'zod';

export const tournamentFormSchema = z.object({
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

export type TournamentFormData = z.infer<typeof tournamentFormSchema>;

// Mock data for clubs
export const clubs = [
  { id: '1', name: 'Clube de Poker A' },
  { id: '2', name: 'Clube de Poker B' },
  { id: '3', name: 'Clube de Poker C' },
];

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
