
import React from "react";
import { BarChart3, PieChart } from "lucide-react";
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="flex gap-6 flex-wrap">
        <div className="bg-white rounded shadow px-6 py-4 flex-1 min-w-min">
          <div className="text-gray-500 mb-1">ROI Total</div>
          <div className={`font-bold text-2xl ${roi >= 0 ? "text-green-600" : "text-red-600"}`}>
            {(roi * 100).toFixed(2)}%
          </div>
        </div>
        <div className="bg-white rounded shadow px-6 py-4 flex-1 min-w-min">
          <div className="text-gray-500 mb-1">Lucro Líquido do Cavaleiro</div>
          <div className="font-bold text-2xl text-poker-gold">
            R$ {playerProfit.toLocaleString("pt-BR", {minimumFractionDigits:2})}
          </div>
        </div>
        <div className="bg-white rounded shadow px-6 py-4 flex-1 min-w-min">
          <div className="text-gray-500 mb-1">Nº de Backers Ativos</div>
          <div className="font-bold text-2xl text-green-800">{numBackers}</div>
        </div>
      </div>
      <div className="flex gap-8 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="flex items-center gap-2 mb-1 text-poker-gold font-semibold">
            <BarChart3 /> Receita por Torneio
          </div>
          <div className="bg-white rounded shadow p-4 min-h-[150px]">
            {revenueByTournament.length === 0 ? (
              <span className="text-gray-400 flex justify-center">Nenhum dado ainda</span>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueByTournament}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#F6C94A" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-[300px]">
          <div className="flex items-center gap-2 mb-1 text-poker-gold font-semibold">
            <PieChart /> Distribuição de Lucros
          </div>
          <div className="bg-white rounded shadow p-4 min-h-[150px]">
            {profitDistribution.every((s) => s.value === 0) ? (
              <span className="text-gray-400 flex justify-center">Sem distribuição</span>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={profitDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#F6C94A"
                    label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`}
                  >
                    {profitDistribution.map((_, idx) => (
                      <Cell key={idx} fill={chartColors[idx % chartColors.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      {/* NOVO: Tabela geral dos payouts dos backers */}
      <div className="mt-12">
        <h3 className="font-bold text-lg mb-3">Geral - Investimento & Retorno por Backer</h3>
        <BackersPayoutTable />
      </div>
    </div>
  );
};

export default BackingDashboardSection;
