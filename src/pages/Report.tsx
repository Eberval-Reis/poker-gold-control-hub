import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, Calendar, DollarSign, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import ExpenseReportTable from "@/components/report/ExpenseReportTable";
import ExpenseReportChart from "@/components/report/ExpenseReportChart";
import PerformanceReportPreview from "@/components/report/PerformanceReportPreview";
import FinancialReportPreview from "@/components/report/FinancialReportPreview";
import RoiReportPreview from "@/components/report/RoiReportPreview";
import { useReportData, ReportType, PeriodType } from "@/hooks/useReportData";

const Report = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<PeriodType>("month");
  const [reportType, setReportType] = useState<ReportType>("performance");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Estado se relatório foi gerado
  const [reportReady, setReportReady] = useState(false);

  // Hook dos dados de relatório
  const reportData = useReportData({
    reportType,
    period,
    startDate,
    endDate,
  });

  const handleGenerateReport = () => {
    setReportReady(true);
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-[#d4af37]" />
          <h1 className="text-2xl font-bold text-poker-text-dark">Relatórios</h1>
        </div>
        <p className="text-gray-600">Gere relatórios detalhados sobre seu desempenho</p>
      </div>

      {/* Report Configuration in horizontal flex */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configurações do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col md:flex-row md:items-end md:gap-6 gap-4 w-full"
            onSubmit={e => {
              e.preventDefault();
              handleGenerateReport();
            }}
          >
            <div className="flex flex-col md:w-56">
              <label className="text-sm font-medium mb-2 block">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Desempenho em Torneios</SelectItem>
                  <SelectItem value="financial">Análise Financeira</SelectItem>
                  <SelectItem value="expenses">Relatório de Despesas</SelectItem>
                  <SelectItem value="roi">Análise de ROI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col md:w-44">
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {period === 'custom' && (
              <>
                <div className="flex flex-col md:w-44">
                  <label className="text-sm font-medium mb-2 block">Data Inicial</label>
                  <DatePicker 
                    date={startDate}
                    onDateChange={setStartDate}
                    placeholder="Selecione a data inicial"
                  />
                </div>
                <div className="flex flex-col md:w-44">
                  <label className="text-sm font-medium mb-2 block">Data Final</label>
                  <DatePicker 
                    date={endDate}
                    onDateChange={setEndDate}
                    placeholder="Selecione a data final"
                  />
                </div>
              </>
            )}
            <Button 
              type="submit"
              className="w-full md:w-auto bg-[#d4af37] text-white hover:bg-[#d4af37]/90 mt-2 md:mt-0"
            >
              Gerar Relatório
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Report Preview - agora 100% responsivo */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Prévia do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          {reportReady ? (
            <div className="space-y-4">
              {reportType === "expenses" ? (
                <>
                  <h3 className="text-lg font-semibold mb-2 text-poker-text-dark">
                    Relatório de Despesas
                  </h3>
                  {/* Corrigido: agora empilha gráfico + tabela no mobile */}
                  <div className="flex flex-col gap-8 md:gap-8 md:flex-row">
                    <div className="w-full md:w-1/3 flex items-center justify-center h-full min-h-[180px] md:min-h-[200px]">
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
                <FinancialReportPreview
                  performances={reportData.performances}
                  expenses={reportData.expenses}
                  periodRange={{ start: reportData.start, end: reportData.end }}
                />
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
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione as configurações e gere seu relatório
              </h3>
              <p className="text-gray-500">
                O relatório será exibido aqui após a geração
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Relatórios Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-[#d4af37] mb-2" />
              <h3 className="font-medium">ROI Mensal</h3>
              <p className="text-sm text-gray-500">Análise do retorno sobre investimento</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto text-[#d4af37] mb-2" />
              <h3 className="font-medium">Atividade Semanal</h3>
              <p className="text-sm text-gray-500">Torneios jogados na semana</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto text-[#d4af37] mb-2" />
              <h3 className="font-medium">Despesas Mensais</h3>
              <p className="text-sm text-gray-500">Gastos relacionados ao poker</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 mx-auto text-[#d4af37] mb-2" />
              <h3 className="font-medium">Melhores Resultados</h3>
              <p className="text-sm text-gray-500">Top 10 performances</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Report;
