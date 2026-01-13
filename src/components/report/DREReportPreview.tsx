import React from "react";
import { DollarSign, TrendingUp, Gift, MinusCircle, CheckCircle, Target, RefreshCw, PlusCircle, Receipt } from "lucide-react";
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
    { item: "--- CUSTOS DE TORNEIO ---", valor: "" },
    { item: "(-) Buy-ins", valor: formatCurrency(data.buyins) },
    { item: "(-) Rebuys", valor: formatCurrency(data.rebuys) },
    { item: "(-) Addons", valor: formatCurrency(data.addons) },
    { item: "Subtotal Custos de Torneio", valor: formatCurrency(data.custosTorneio) },
    { item: "--- OUTRAS DESPESAS ---", valor: "" },
    { item: "(-) Despesas Gerais", valor: formatCurrency(data.despesas) },
    { item: "Total de Custos", valor: formatCurrency(data.totalCustos) },
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
        <div className="flex items-center justify-between py-4 border-b border-border/50 bg-muted/30 -mx-4 sm:-mx-6 px-4 sm:px-6">
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

        {/* Seção: Custos de Torneio */}
        <div className="mt-4 mb-2">
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Custos de Torneio
          </h5>
        </div>

        {/* Buy-ins */}
        <div className="flex items-center justify-between py-3 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">(-) Buy-ins</h4>
              <p className="text-xs text-muted-foreground">Inscrições nos torneios</p>
            </div>
          </div>
          <span className="text-base font-semibold text-orange-500">
            {formatCurrency(data.buyins)}
          </span>
        </div>

        {/* Rebuys */}
        <div className="flex items-center justify-between py-3 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">(-) Rebuys</h4>
              <p className="text-xs text-muted-foreground">Recompras realizadas</p>
            </div>
          </div>
          <span className="text-base font-semibold text-orange-500">
            {formatCurrency(data.rebuys)}
          </span>
        </div>

        {/* Addons */}
        <div className="flex items-center justify-between py-3 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <PlusCircle className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">(-) Addons</h4>
              <p className="text-xs text-muted-foreground">Add-ons adquiridos</p>
            </div>
          </div>
          <span className="text-base font-semibold text-orange-500">
            {formatCurrency(data.addons)}
          </span>
        </div>

        {/* Subtotal Custos de Torneio */}
        <div className="flex items-center justify-between py-3 border-b border-border/50 bg-orange-500/5 -mx-4 sm:-mx-6 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <MinusCircle className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Subtotal Custos de Torneio</h4>
            </div>
          </div>
          <span className="text-base font-bold text-orange-600">
            {formatCurrency(data.custosTorneio)}
          </span>
        </div>

        {/* Seção: Outras Despesas */}
        <div className="mt-4 mb-2">
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Outras Despesas
          </h5>
        </div>

        {/* Despesas Gerais */}
        <div className="flex items-center justify-between py-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">(-) Despesas Gerais</h4>
              <p className="text-xs text-muted-foreground">Transporte, alimentação, hospedagem, etc.</p>
            </div>
          </div>
          <span className="text-base font-semibold text-destructive">
            {formatCurrency(data.despesas)}
          </span>
        </div>

        {/* Total de Custos */}
        <div className="flex items-center justify-between py-3 bg-destructive/5 -mx-4 sm:-mx-6 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
              <MinusCircle className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Total de Custos</h4>
              <p className="text-xs text-muted-foreground">Torneio + Despesas gerais</p>
            </div>
          </div>
          <span className="text-base font-bold text-destructive">
            {formatCurrency(data.totalCustos)}
          </span>
        </div>

        {/* Divider visual */}
        <div className="border-t-2 border-dashed border-border my-4" />

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
              <p className="text-sm text-muted-foreground">Resultado final após todos os custos</p>
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