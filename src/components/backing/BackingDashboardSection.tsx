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
    <div className="space-y-6 w-full">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      
      {/* Métricas principais - Grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
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
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <DollarSign className="h-5 w-5 text-poker-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">Lucro do Cavaleiro</p>
                <p className="text-xl font-bold text-poker-gold">
                  R$ {playerProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-poker-gold">
              <BarChart3 className="h-5 w-5" />
              Receita por Torneio
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {revenueByTournament.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Nenhum dado ainda
              </div>
            ) : (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByTournament} margin={{ left: -10, right: 10 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11 }} 
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 11 }} width={50} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Receita"]}
                    />
                    <Bar dataKey="value" fill="#F6C94A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-poker-gold">
              <PieChart className="h-5 w-5" />
              Distribuição de Lucros
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {profitDistribution.every((s) => s.value === 0) ? (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Sem distribuição
              </div>
            ) : (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={profitDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#F6C94A"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {profitDistribution.map((_, idx) => (
                        <Cell key={idx} fill={chartColors[idx % chartColors.length]} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Lucro"]}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de payouts */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Geral - Investimento & Retorno por Backer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 overflow-x-auto">
          <BackersPayoutTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default BackingDashboardSection;
