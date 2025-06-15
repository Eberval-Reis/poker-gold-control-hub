
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RecentTournamentsTableProps {
  data: any[];
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Torneio</th>
            <th className="text-left p-2">Data</th>
            <th className="text-left p-2">Buy-in</th>
            <th className="text-left p-2">Rebuy</th>
            <th className="text-left p-2">Addon</th>
            <th className="text-left p-2">Prêmio</th>
            <th className="text-left p-2">Resultado</th>
          </tr>
        </thead>
        <tbody>
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
                <tr key={p.id || idx} className="hover:bg-gray-50">
                  <td className="p-2 text-sm">{tournamentName}</td>
                  <td className="p-2 text-sm">{p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : "-"}</td>
                  <td className="p-2 text-sm">{formatCurrency(buyin)}</td>
                  <td className="p-2 text-sm">{formatCurrency(rebuy)}</td>
                  <td className="p-2 text-sm">{formatCurrency(addon)}</td>
                  <td className="p-2 text-sm">{formatCurrency(prize)}</td>
                  <td className="p-2 text-sm">
                    <div className="flex items-center gap-1">
                      {result >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-[#006400]" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-[#8b0000]" />
                      )}
                      <span className={result >= 0 ? 'text-[#006400]' : 'text-[#8b0000]'}>
                        {formatCurrency(result)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
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

