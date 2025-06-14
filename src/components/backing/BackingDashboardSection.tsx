
import React from "react";
import { BarChart3, PieChart } from "lucide-react";

const BackingDashboardSection = () => {
  // Placeholders
  const roi = 0.08; // 8%
  const lucro = 15000;
  const backers = 5;

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="flex gap-6 flex-wrap">
        <div className="bg-white rounded shadow px-6 py-4 flex-1 min-w-min">
          <div className="text-gray-500 mb-1">ROI Total</div>
          <div className={`font-bold text-2xl ${roi >= 0 ? "text-green-600" : "text-red-600"}`}>
            {roi * 100}%
          </div>
        </div>
        <div className="bg-white rounded shadow px-6 py-4 flex-1 min-w-min">
          <div className="text-gray-500 mb-1">Lucro Líquido do Cavaleiro</div>
          <div className="font-bold text-2xl text-poker-gold">R$ {lucro.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded shadow px-6 py-4 flex-1 min-w-min">
          <div className="text-gray-500 mb-1">Nº de Backers Ativos</div>
          <div className="font-bold text-2xl text-green-800">{backers}</div>
        </div>
      </div>
      <div className="flex gap-8 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="flex items-center gap-2 mb-1 text-poker-gold font-semibold">
            <BarChart3 /> Receita por Torneio
          </div>
          <div className="bg-white rounded shadow p-4 min-h-[150px] flex items-center justify-center">
            <span className="text-gray-400">[Gráfico de Barras Aqui]</span>
          </div>
        </div>
        <div className="flex-1 min-w-[300px]">
          <div className="flex items-center gap-2 mb-1 text-poker-gold font-semibold">
            <PieChart /> Distribuição de Lucros
          </div>
          <div className="bg-white rounded shadow p-4 min-h-[150px] flex items-center justify-center">
            <span className="text-gray-400">[Gráfico de Pizza Aqui]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BackingDashboardSection;
