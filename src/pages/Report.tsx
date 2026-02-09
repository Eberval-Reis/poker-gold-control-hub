import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, Calendar, DollarSign, Trophy, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReportConfigForm from "@/components/report/ReportConfigForm";
import ReportPreview from "@/components/report/ReportPreview";
import { useReportData, ReportType, PeriodType } from "@/hooks/useReportData";
import { ReportData } from "@/types";
import { useDREReportData } from "@/hooks/useDREReportData";
import ExpenseAdvancedFilters from "@/components/report/ExpenseAdvancedFilters";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Update the quickReports type!
const quickReports: {
  title: string,
  description: string,
  icon: JSX.Element,
  reportType: ReportType,
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
      title: "DRE Mensal",
      description: "Demonstração do resultado",
      icon: <BarChart3 className="h-8 w-8 mx-auto text-[#d4af37] mb-2" />,
      reportType: "dre",
      period: "month",
    },
  ];

const Report = () => {
  const navigate = useNavigate();
  // Ajustar para "all" ao invés de ""
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [period, setPeriod] = useState<PeriodType>("month");
  const [reportType, setReportType] = useState<ReportType>("performance");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [comparisonStart, setComparisonStart] = useState<Date>();
  const [comparisonEnd, setComparisonEnd] = useState<Date>();
  const [reportReady, setReportReady] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // DRE filters
  const [eventId, setEventId] = useState<string>();
  const [tournamentId, setTournamentId] = useState<string>();

  const reportData = useReportData({
    reportType,
    period,
    startDate,
    endDate,
  });

  // DRE data
  const dreData = useDREReportData({
    period,
    startDate,
    endDate,
    eventId,
    tournamentId,
  });

  // Fetch event and tournament names for display
  const { data: events = [] } = useQuery({
    queryKey: ["events-names"],
    queryFn: async () => {
      const { data } = await supabase.from("schedule_events").select("id, name");
      return data || [];
    },
  });

  const { data: tournaments = [] } = useQuery({
    queryKey: ["tournaments-names"],
    queryFn: async () => {
      const { data } = await supabase.from("tournaments").select("id, name");
      return data || [];
    },
  });

  const selectedEventName = events.find((e) => e.id === eventId)?.name;
  const selectedTournamentName = tournaments.find((t) => t.id === tournamentId)?.name;

  // Atualizar filtro: só aplica categoria se não for "all" e tipo for "expenses"
  const filteredExpenses =
    reportType === "expenses" && selectedCategory !== "all"
      ? reportData.expenses.filter((e) => e.type === selectedCategory)
      : reportData.expenses;

  const filteredExpenseSumByCategory =
    reportType === "expenses" && selectedCategory !== "all"
      ? reportData.expenseSumByCategory.filter((c) => c.category === selectedCategory)
      : reportData.expenseSumByCategory;

  const filteredReportData = {
    ...reportData,
    expenses: reportType === "expenses" ? filteredExpenses : reportData.expenses,
    expenseSumByCategory: reportType === "expenses" ? filteredExpenseSumByCategory : reportData.expenseSumByCategory,
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
    // Reset DRE filters
    setEventId(undefined);
    setTournamentId(undefined);
    setFormError(null);
    setReportReady(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Busca todas categorias possíveis (no período!)
  const allCategories = Array.from(
    new Set((reportData.expenseSumByCategory || []).map((c) => c.category))
  );

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 overflow-x-hidden">
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
        eventId={eventId}
        setEventId={setEventId}
        tournamentId={tournamentId}
        setTournamentId={setTournamentId}
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
            reportData={filteredReportData as ReportData}
            comparisonA={{ period: { start: comparisonStart, end: comparisonEnd } }}
            comparisonB={{ period: { start: startDate, end: endDate } }}
            dreData={dreData}
            eventName={selectedEventName}
            tournamentName={selectedTournamentName}
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
              className="cursor-pointer hover:shadow-md transition-shadow min-w-0"
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
