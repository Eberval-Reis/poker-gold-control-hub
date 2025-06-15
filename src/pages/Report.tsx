import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, Calendar, DollarSign, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReportConfigForm from "@/components/report/ReportConfigForm";
import ReportPreview from "@/components/report/ReportPreview";
import { useReportData, PeriodType } from "@/hooks/useReportData";
import ExpenseAdvancedFilters from "@/components/report/ExpenseAdvancedFilters";

const quickReports: {
  title: string,
  description: string,
  icon: JSX.Element,
  reportType: string,
  period: PeriodType,
  extra?: { startDate?: Date, endDate?: Date },
}[] = [
  {
    title: "ROI Mensal",
    description: "Análise do retorno sobre investimento",
    icon: <TrendingUp className="h-8 w-8 mx-auto text-[#d4af37] mb-2" />,
    reportType: "roi",
    period: "month",
  },
  {
    title: "Atividade Semanal",
    description: "Torneios jogados na semana",
    icon: <Calendar className="h-8 w-8 mx-auto text-[#d4af37] mb-2" />,
    reportType: "performance",
    period: "week",
  },
  {
    title: "Despesas Mensais",
    description: "Gastos relacionados ao poker",
    icon: <DollarSign className="h-8 w-8 mx-auto text-[#d4af37] mb-2" />,
    reportType: "expenses",
    period: "month",
  },
  {
    title: "Melhores Resultados",
    description: "Top 10 performances",
    icon: <Trophy className="h-8 w-8 mx-auto text-[#d4af37] mb-2" />,
    reportType: "performance",
    period: "month",
  },
];

const Report = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<string>("month");
  const [reportType, setReportType] = useState<string>("performance");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [comparisonStart, setComparisonStart] = useState<Date>();
  const [comparisonEnd, setComparisonEnd] = useState<Date>();
  const [reportReady, setReportReady] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filtro extra de categoria para despesas
  const [selectedCategory, setSelectedCategory] = useState("");

  const reportData = useReportData({
    reportType,
    period,
    startDate,
    endDate,
  });

  // Aplica filtro de categoria SOMENTE em despesas
  const filteredExpenses =
    reportType === "expenses" && selectedCategory
      ? reportData.expenses.filter((e: any) => e.type === selectedCategory)
      : reportData.expenses;

  const filteredReportData = {
    ...reportData,
    // Só filtra expenseSumByCategory se foi filtrado
    expenses: filteredExpenses,
    expenseSumByCategory:
      reportType === "expenses" && selectedCategory
        ? reportData.expenseSumByCategory.filter((c: any) => c.category === selectedCategory)
        : reportData.expenseSumByCategory,
  };

  // Novo: gerar reportReady de comparação com validação simples
  const handleGenerateReport = () => {
    if (reportType === "comparison") {
      if (!comparisonStart || !comparisonEnd || !startDate || !endDate) {
        setFormError("Preencha os dois períodos!");
        setReportReady(false);
        return;
      }
      if (comparisonStart > comparisonEnd) {
        setFormError("Período A: início não pode ser após o fim.");
        setReportReady(false);
        return;
      }
      if (startDate > endDate) {
        setFormError("Período B: início não pode ser após o fim.");
        setReportReady(false);
        return;
      }
      setFormError(null);
      setReportReady(true);
      return;
    }
    // ...existing validation...
    setFormError(null);
    setReportReady(true);
  };

  const handleQuickReport = (item: typeof quickReports[0]) => {
    setPeriod(item.period);
    setReportType(item.reportType);
    // Limpa datas se não for custom
    if (item.period !== "custom") {
      setStartDate(undefined);
      setEndDate(undefined);
    } else {
      setStartDate(item.extra?.startDate);
      setEndDate(item.extra?.endDate);
    }
    setFormError(null);
    setReportReady(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Busca todas categorias possíveis (no período!)
  const allCategories = Array.from(
    new Set((reportData.expenseSumByCategory || []).map((c: any) => c.category))
  );

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-[#d4af37]" />
          <h1 className="text-2xl font-bold text-poker-text-dark">Relatórios</h1>
        </div>
        <p className="text-gray-600">Gere relatórios detalhados sobre seu desempenho</p>
      </div>

      {/* Report Configuration */}
      <ReportConfigForm
        period={period}
        setPeriod={setPeriod}
        reportType={reportType}
        setReportType={setReportType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onGenerate={handleGenerateReport}
        formError={formError}
        comparisonStart={comparisonStart}
        setComparisonStart={setComparisonStart}
        comparisonEnd={comparisonEnd}
        setComparisonEnd={setComparisonEnd}
      />

      {/* Filtro Avançado para Despesas */}
      {reportType === "expenses" && reportReady && (
        <ExpenseAdvancedFilters
          categories={allCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* Report Preview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Prévia do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportPreview 
            reportReady={reportReady}
            reportType={reportType}
            reportData={filteredReportData}
            comparisonA={{ period: { start: comparisonStart, end: comparisonEnd } }}
            comparisonB={{ period: { start: startDate, end: endDate } }}
          />
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Relatórios Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickReports.map((item, idx) => (
            <Card
              key={item.title}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleQuickReport(item)}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") handleQuickReport(item);
              }}
              aria-label={`Abrir relatório rápido: ${item.title}`}
            >
              <CardContent className="p-4 text-center">
                {item.icon}
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;
