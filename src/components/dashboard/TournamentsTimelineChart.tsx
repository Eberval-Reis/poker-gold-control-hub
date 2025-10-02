import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subMonths, isAfter, parseISO } from 'date-fns';

interface TournamentsTimelineChartProps {
  data: { name: string; date: string; buyin: number; prize: number; profit: number }[];
}

type PeriodFilter = 'current-month' | 'last-quarter' | 'last-semester' | 'last-year';

const TournamentsTimelineChart = ({ data }: TournamentsTimelineChartProps) => {
  const isMobile = useIsMobile();
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('current-month');
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  };

  const getBarColor = (profit: number) => {
    return profit >= 0 ? '#22c55e' : '#ef4444'; // Verde para lucro, vermelho para prejuízo
  };

  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (periodFilter) {
      case 'current-month':
        startDate = subMonths(now, 1);
        break;
      case 'last-quarter':
        startDate = subMonths(now, 3);
        break;
      case 'last-semester':
        startDate = subMonths(now, 6);
        break;
      case 'last-year':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subMonths(now, 1);
    }

    return data.filter(item => {
      try {
        const itemDate = parseISO(item.date);
        return isAfter(itemDate, startDate);
      } catch {
        return false;
      }
    });
  }, [data, periodFilter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Torneios ao Longo do Tempo</h3>
        <Select value={periodFilter} onValueChange={(value) => setPeriodFilter(value as PeriodFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-month">Último Mês</SelectItem>
            <SelectItem value="last-quarter">Último Trimestre</SelectItem>
            <SelectItem value="last-semester">Último Semestre</SelectItem>
            <SelectItem value="last-year">Último Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className={isMobile ? "h-[400px] w-full" : "h-[300px] w-full"}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={isMobile 
              ? { top: 5, right: 10, left: 0, bottom: 60 }
              : { top: 5, right: 30, left: 20, bottom: 60 }
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: isMobile ? 8 : 10 }}
              height={80}
            />
            <YAxis 
              tickFormatter={isMobile ? (value) => `${value}` : (value) => `R$ ${value.toLocaleString('pt-BR')}`}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 40 : 60}
            />
            <Tooltip
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  buyin: 'Buy-in Total',
                  prize: 'Premiação',
                  profit: 'Lucro/Prejuízo'
                };
                return [`R$ ${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, labels[name as string] || name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return `${label} - ${formatDate(data.date)}`;
                }
                return label;
              }}
            />
            <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.profit)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Lucro</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Prejuízo</span>
        </div>
      </div>
    </div>
  );
};

export default TournamentsTimelineChart;
