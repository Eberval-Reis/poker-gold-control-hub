import React from "react";
import { DollarSign, TrendingUp, Gift, MinusCircle, CheckCircle } from "lucide-react";
import { DREData } from "@/hooks/useDREReportData";
import ExportButtons from "./ExportButtons";

interface DREReportPreviewProps {
  data: DREData & { start: Date; end: Date };
  eventName?: string;
  tournamentName?: string;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const DREReportPreview: React.FC<DREReportPreviewProps> = ({
  data,
  eventName,
  tournamentName,
}) => {
  if (data.loading) {
    return (
      <div className="py-8 text-center">
        <span className="animate-spin inline-block h-6 w-6 rounded-full border-2 border-current border-t-transparent mr-2"></span>
        Carregando dados...
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="text-destructive py-4">
        Erro ao carregar dados: {String(data.error)}
      </div>
    );
  }

  const filterLabel = tournamentName
    ? tournamentName
    : eventName
    ? eventName
    : "Todos os Torneios";

  const periodLabel = `${data.start.toLocaleDateString("pt-BR")} a ${data.end.toLocaleDateString("pt-BR")}`;

  // Dados para exportação
  const exportData = [
    { item: "Receita (Prêmios)", valor: formatCurrency(data.receita) },
    { item: "(+) Cavalagem", valor: formatCurrency(data.cavalagem) },
    { item: "Total Bruto", valor: formatCurrency(data.totalBruto) },
    { item: "(-) Despesas", valor: formatCurrency(data.despesas) },
    { item: "Total Líquido", valor: formatCurrency(data.totalLiquido) },
  ];

  const exportColumns = [
    { label: "Item", key: "item" },
    { label: "Valor", key: "valor" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Demonstração do Resultado
          </h3>
          <p className="text-sm text-muted-foreground">
            {filterLabel} • {periodLabel}
          </p>
        </div>
        <ExportButtons
          tableData={exportData}
          columns={exportColumns}
          filePrefix="dre"
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
        {/* Receita */}
        <div className="flex items-center justify-between py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Receita (Prêmios)</h4>
              <p className="text-sm text-muted-foreground">Ganhos totais com premiações</p>
            </div>
          </div>
          <span className="text-lg font-bold text-green-500">
            {formatCurrency(data.receita)}
          </span>
        </div>

        {/* Cavalagem */}
        <div className="flex items-center justify-between py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Gift className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">(+) Cavalagem</h4>
              <p className="text-sm text-muted-foreground">Patrocínio ou investimento externo</p>
            </div>
          </div>
          <span className="text-lg font-bold text-green-500">
            {formatCurrency(data.cavalagem)}
          </span>
        </div>

        {/* Divider visual */}
        <div className="border-t-2 border-dashed border-border my-2" />

        {/* Total Bruto */}
        <div className="flex items-center justify-between py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Total Bruto</h4>
              <p className="text-sm text-muted-foreground">Soma da receita e cavalagem</p>
            </div>
          </div>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(data.totalBruto)}
          </span>
        </div>

        {/* Despesas */}
        <div className="flex items-center justify-between py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <MinusCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">(-) Despesas</h4>
              <p className="text-sm text-muted-foreground">Buy-ins, taxas, viagens, hospedagem, etc.</p>
            </div>
          </div>
          <span className="text-lg font-bold text-destructive">
            {formatCurrency(data.despesas)}
          </span>
        </div>

        {/* Divider visual */}
        <div className="border-t-2 border-dashed border-border my-2" />

        {/* Total Líquido */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              data.totalLiquido >= 0 ? "bg-green-500/20" : "bg-destructive/20"
            }`}>
              <CheckCircle className={`w-5 h-5 ${
                data.totalLiquido >= 0 ? "text-green-500" : "text-destructive"
              }`} />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Total Líquido</h4>
              <p className="text-sm text-muted-foreground">Lucro final após todas as despesas</p>
            </div>
          </div>
          <span className={`text-xl font-bold ${
            data.totalLiquido >= 0 ? "text-green-500" : "text-destructive"
          }`}>
            {formatCurrency(data.totalLiquido)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DREReportPreview;
