
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { ReportType, PeriodType } from "@/hooks/useReportData";

interface ReportConfigFormProps {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
  reportType: ReportType;
  setReportType: (type: ReportType) => void;
  startDate?: Date;
  setStartDate: (date?: Date) => void;
  endDate?: Date;
  setEndDate: (date?: Date) => void;
  onGenerate: () => void;
}

const ReportConfigForm: React.FC<ReportConfigFormProps> = ({
  period,
  setPeriod,
  reportType,
  setReportType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onGenerate
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Configurações do Relatório</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col md:flex-row md:items-end md:gap-6 gap-4 w-full"
          onSubmit={e => { e.preventDefault(); onGenerate(); }}
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
          {period === "custom" && (
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
  );
};

export default ReportConfigForm;
