import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, Calendar, DollarSign, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReportConfigForm from "@/components/report/ReportConfigForm";
import ReportPreview from "@/components/report/ReportPreview";
import { useReportData, ReportType, PeriodType } from "@/hooks/useReportData";

const Report = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<PeriodType>("month");
  const [reportType, setReportType] = useState<ReportType>("performance");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reportReady, setReportReady] = useState(false);

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
      />

      {/* Report Preview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Prévia do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportPreview 
            reportReady={reportReady}
            reportType={reportType}
            reportData={reportData}
          />
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
