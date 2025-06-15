
import React from "react";
import { FileText } from "lucide-react";
import ExpenseReportChart from "@/components/report/ExpenseReportChart";
import ExpenseReportTable from "@/components/report/ExpenseReportTable";
import PerformanceReportPreview from "@/components/report/PerformanceReportPreview";
import FinancialReportPreview from "@/components/report/FinancialReportPreview";
import RoiReportPreview from "@/components/report/RoiReportPreview";
import ExportButtons from "@/components/report/ExportButtons";
import { ReportType } from "@/hooks/useReportData";

interface ReportPreviewProps {
  reportReady: boolean;
  reportType: ReportType;
  reportData: any;
}

const expenseTableColumns = [
  { label: "Data", key: "date" },
  { label: "Torneio", key: "tournament" },
  { label: "Categoria", key: "type" },
  { label: "Valor (R$)", key: "amount" }
];

const ReportPreview: React.FC<ReportPreviewProps> = ({ reportReady, reportType, reportData }) => {
  if (!reportReady) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Selecione as configurações e gere seu relatório
        </h3>
        <p className="text-gray-500">
          O relatório será exibido aqui após a geração
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reportType === "expenses" ? (
        <>
          <h3 className="text-lg font-semibold mb-2 text-poker-text-dark">
            Relatório de Despesas
          </h3>
          {/* Exportação */}
          <ExportButtons
            tableData={reportData.expenses.map((e: any) => ({
              date: e.date ? new Date(e.date).toLocaleDateString("pt-BR") : "-",
              tournament: e.tournaments?.name || "-",
              type: e.type,
              amount: Number(e.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            }))}
            columns={expenseTableColumns}
            filePrefix="despesas"
          />
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-8">
            <div className="w-full md:w-1/3 flex items-center justify-center min-h-[220px] md:min-h-[380px]">
              <ExpenseReportChart data={reportData.expenseSumByCategory} />
            </div>
            <div className="w-full md:w-2/3">
              <ExpenseReportTable expenses={reportData.expenses} />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-3 text-right">
            Período: {reportData.start.toLocaleDateString()} a {reportData.end.toLocaleDateString()}
          </div>
        </>
      ) : reportType === "performance" ? (
        <PerformanceReportPreview
          performances={reportData.performances}
          periodRange={{ start: reportData.start, end: reportData.end }}
        />
      ) : reportType === "financial" ? (
        <>
          {/* Exportação para financeiro também */}
          <ExportButtons
            tableData={[
              ...reportData.performances.map((perf: any) => ({
                tipo: "Prêmio",
                data: perf.created_at ? new Date(perf.created_at).toLocaleDateString("pt-BR") : "-",
                torneio: perf.tournaments?.name ?? "-",
                valor: Number(perf.prize_amount ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
              })),
              ...reportData.expenses.map((exp: any) => ({
                tipo: "Despesa",
                data: exp.date ? new Date(exp.date).toLocaleDateString("pt-BR") : "-",
                torneio: exp.tournaments?.name || "-",
                valor: Number(exp.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
              }))
            ]}
            columns={[
              { label: "Tipo", key: "tipo" },
              { label: "Data", key: "data" },
              { label: "Torneio", key: "torneio" },
              { label: "Valor (R$)", key: "valor" }
            ]}
            filePrefix="financeiro"
          />
          <FinancialReportPreview
            performances={reportData.performances}
            expenses={reportData.expenses}
            periodRange={{ start: reportData.start, end: reportData.end }}
          />
        </>
      ) : reportType === "roi" ? (
        <RoiReportPreview
          performances={reportData.performances}
          expenses={reportData.expenses}
          periodRange={{ start: reportData.start, end: reportData.end }}
        />
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          Relatório para este tipo ainda não implementado.
        </div>
      )}
      {reportData.loading && (
        <div className="flex items-center justify-center gap-2 text-yellow-700">
          <span className="animate-spin h-5 w-5 rounded-full border-2 border-current border-t-transparent"></span>
          Carregando dados do relatório...
        </div>
      )}
      {reportData.error && (
        <div className="text-red-600 py-4">
          Erro ao carregar dados do relatório: {String(reportData.error)}
        </div>
      )}
    </div>
  );
};

export default ReportPreview;
