
import { TrendingUp, TrendingDown } from 'lucide-react';

import { PokerPerformance } from '@/types';

interface RecentTournamentsTableProps {
  data: PokerPerformance[];
}

const RecentTournamentsTable = ({ data }: RecentTournamentsTableProps) => {
  // Helper to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="overflow-x-auto rounded-sm border border-border/40 bg-card shadow-sm animate-reveal">
      <table className="w-full">
        <thead className="bg-muted/50 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
          <tr className="border-b border-border/40">
            <th className="text-left p-4 font-montserrat text-xs uppercase tracking-widest text-muted-foreground">Torneio</th>
            <th className="text-left p-4 font-montserrat text-xs uppercase tracking-widest text-muted-foreground">Data</th>
            <th className="text-left p-4 font-montserrat text-xs uppercase tracking-widest text-muted-foreground">Buy-in</th>
            <th className="text-left p-4 font-montserrat text-xs uppercase tracking-widest text-muted-foreground">Rebuy</th>
            <th className="text-left p-4 font-montserrat text-xs uppercase tracking-widest text-muted-foreground">Addon</th>
            <th className="text-left p-4 font-montserrat text-xs uppercase tracking-widest text-muted-foreground">Prêmio</th>
            <th className="text-left p-4 font-montserrat text-xs uppercase tracking-widest text-muted-foreground">Resultado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/20">
          {data.length > 0 ? (
            data.map((p, idx) => {
              const buyin = Number(p.buyin_amount || 0);
              const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
              const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
              const invested = buyin + rebuy + addon;
              const prize = Number(p.prize_amount || 0);
              const result = prize - invested;
              const tournamentName = p.tournaments?.name || 'Torneio não especificado';
              return (
                <tr key={p.id || idx} className="hover:bg-accent/30 transition-colors group">
                  <td className="p-4 text-sm font-medium text-foreground">{tournamentName}</td>
                  <td className="p-4 text-sm text-muted-foreground">{p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : "-"}</td>
                  <td className="p-4 text-sm font-mono">{formatCurrency(buyin)}</td>
                  <td className="p-4 text-sm font-mono">{formatCurrency(rebuy)}</td>
                  <td className="p-4 text-sm font-mono">{formatCurrency(addon)}</td>
                  <td className="p-4 text-sm font-mono">{formatCurrency(prize)}</td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-2">
                      {result >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`font-bold font-mono ${result >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatCurrency(result)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="p-8 text-center text-muted-foreground italic font-sans">
                Nenhum registro de performance encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTournamentsTable;

