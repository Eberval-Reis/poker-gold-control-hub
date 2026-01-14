import React from "react";
import { BarChart3, PieChart, TrendingUp, Users, DollarSign } from "lucide-react";
import { useBackingDashboardData } from "@/hooks/useBackingDashboardData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Pie,
  PieChart as RePieChart,
  Cell,
  Legend,
} from "recharts";
import BackersPayoutTable from "./BackersPayoutTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartColors = ["#F6C94A", "#5B870B", "#a2a2a2", "#E16900", "#F85043", "#22c55e"];

const BackingDashboardSection = () => {
  const {
    roi,
    playerProfit,
    numBackers,
    revenueByTournament,
    profitDistribution,
    isLoading,
    isError,
  } = useBackingDashboardData();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-32 text-poker-gold">
        Carregando dados do dashboard...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center py-32 text-red-500">
        Erro ao carregar o dashboard de cavalagem.
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full overflow-hidden">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      
      {/* Métricas principais - Grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 shrink-0">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">ROI Total</p>
                <p className={`text-xl font-bold ${roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {(roi * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 shrink-0">
                <DollarSign className="h-5 w-5 text-poker-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">Lucro Cavaleiro</p>
                <p className="text-lg font-bold text-poker-gold truncate">
                  R$ {playerProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">Backers Ativos</p>
                <p className="text-xl font-bold text-foreground">{numBackers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos - Stack vertical no mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 px-3 sm:px-4">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-poker-gold">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span className="truncate">Receita por Torneio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 pt-0">
            {revenueByTournament.length === 0 ? (
              <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
                Nenhum dado ainda
              </div>
            ) : (
              <div className="h-[180px] sm:h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={revenueByTournament} 
                    margin={{ left: 0, right: 5, top: 5, bottom: 5 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10 }} 
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={50}
                      tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }} 
                      width={40}
                      tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Receita"]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="value" fill="#F6C94A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 px-3 sm:px-4">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-poker-gold">
              <PieChart className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span className="truncate">Distribuição de Lucros</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 pt-0">
            {profitDistribution.every((s) => s.value === 0) ? (
              <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
                Sem distribuição
              </div>
            ) : (
              <div className="h-[180px] sm:h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                      data={profitDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={50}
                      fill="#F6C94A"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {profitDistribution.map((_, idx) => (
                        <Cell key={idx} fill={chartColors[idx % chartColors.length]} />
                      ))}
                    </Pie>
                    <Legend 
                      wrapperStyle={{ fontSize: 11, paddingTop: 5 }}
                      iconSize={10}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Lucro"]}
                      contentStyle={{ fontSize: 12 }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de payouts */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 px-3 sm:px-4">
          <CardTitle className="text-sm sm:text-base">
            Investimento & Retorno por Backer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <BackersPayoutTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default BackingDashboardSection;
