
import { z } from 'zod';

export const tournamentResultSchema = z.object({
  club_id: z.string().min(1, 'Clube é obrigatório'),
  tournament_id: z.string().min(1, 'Torneio é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  itm_achieved: z.boolean().default(false),
  position: z.number().min(1, 'Posição deve ser maior que 0').optional(),
  prize_amount: z.number().min(0, 'Valor do prêmio deve ser positivo').optional(),
  ft_achieved: z.boolean().default(false),
  ft_photo_url: z.string().optional(),
  news_link: z.string().url('Link deve ser uma URL válida').optional().or(z.literal(''))
});

export type TournamentResultFormData = z.infer<typeof tournamentResultSchema>;
