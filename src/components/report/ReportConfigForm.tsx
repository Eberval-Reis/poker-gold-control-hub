import React from "react";
import { Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PeriodType, ReportType } from "@/hooks/useReportData";

export interface ReportConfigFormProps {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
  reportType: ReportType;
  setReportType: (reportType: ReportType) => void;
  startDate?: Date;
  setStartDate: (startDate?: Date) => void;
  endDate?: Date;
  setEndDate: (endDate?: Date) => void;
  onGenerate: () => void;
  formError: string | null;
  comparisonStart?: Date;
  setComparisonStart?: (date?: Date) => void;
  comparisonEnd?: Date;
  setComparisonEnd?: (date?: Date) => void;
}

const REPORT_TYPE_OPTIONS = [
  { label: "Desempenho", value: "performance" },
  { label: "Despesas", value: "expenses" },
  { label: "Financeiro", value: "financial" },
  { label: "ROI", value: "roi" },
  { label: "Comparativo", value: "comparison" }, // novo tipo
];

const ReportConfigForm: React.FC<ReportConfigFormProps> = ({
  period, setPeriod,
  reportType, setReportType,
  startDate, setStartDate,
  endDate, setEndDate,
  onGenerate,
  formError,
  comparisonStart, setComparisonStart,
  comparisonEnd, setComparisonEnd,
}) => {

  // Define campos base para filtros principais (tipo/período)
  const FiltrosPrincipais = (
    <>
      {/* Tipo de Relatório */}
      <div className="flex-1 min-w-[180px]">
        <label className="block text-sm font-medium mb-1">Tipo de Relatório</label>
        <Select value={reportType} onValueChange={v => setReportType(v as ReportType)}>
          <SelectTrigger className="w-full h-11 text-base" /> 
          <SelectContent>
            {REPORT_TYPE_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Período */}
      <div className="flex-1 min-w-[180px]">
        <label className="block text-sm font-medium mb-1">Período</label>
        <Select value={period} onValueChange={v => setPeriod(v as PeriodType)}>
          <SelectTrigger className="w-full h-11 text-base" /> 
          <SelectContent>
            <SelectItem value="week">Semana Atual</SelectItem>
            <SelectItem value="month">Mês Atual</SelectItem>
            <SelectItem value="quarter">Trimestre Atual</SelectItem>
            <SelectItem value="year">Ano Atual</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onGenerate();
      }}
      className="space-y-5 mb-5"
    >
      {/* Filtros e Botão: layout mobile empilhado, desktop em linha */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 items-stretch">
        {/* Filtros principais */}
        <div className="flex flex-col gap-3 w-full sm:flex-row sm:w-auto flex-1">
          {FiltrosPrincipais}
        </div>
        {/* Botão centralizado/tela cheia no mobile */}
        <div className="w-full sm:min-w-[140px] sm:w-auto">
          <Button
            type="submit"
            className="w-full sm:w-auto bg-poker-gold text-white font-semibold h-12 text-base"
          >
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Inputs customizados para relatório comparativo */}
      {reportType === "comparison" && (
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 mt-2">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs font-semibold">Período A - Início</label>
            <input
              type="date"
              value={comparisonStart ? comparisonStart.toISOString().slice(0,10) : ''}
              onChange={e => setComparisonStart?.(e.target.value ? new Date(e.target.value) : undefined)}
              className="border rounded px-2 py-2 w-full h-11 text-base"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs font-semibold">Período A - Fim</label>
            <input
              type="date"
              value={comparisonEnd ? comparisonEnd.toISOString().slice(0,10) : ''}
              onChange={e => setComparisonEnd?.(e.target.value ? new Date(e.target.value) : undefined)}
              className="border rounded px-2 py-2 w-full h-11 text-base"
            />
          </div>
        </div>
      )}

      {/* Date Range Picker (Custom Period) */}
      {period === "custom" && (
        <div className="space-y-2">
          <Label htmlFor="data" className="text-base">Período</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[280px] justify-start text-left font-normal h-11 text-base",
                  !startDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {startDate ? (
                  endDate ? (
                    `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`
                  ) : (
                    startDate?.toLocaleDateString()
                  )
                ) : (
                  <span>Selecione o período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <DateRangePicker
                date={startDate && endDate ? { from: startDate, to: endDate } : undefined}
                setDate={(date: DateRange) => {
                  setStartDate(date?.from);
                  setEndDate(date?.to);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      {formError && (
        <div className="text-red-700 mt-2">{formError}</div>
      )}
    </form>
  );
}

export default ReportConfigForm;

// Corrigir DateRangePicker - Use DayPicker de 'react-day-picker'
function DateRangePicker({
  date,
  setDate,
}: {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}) {
  return (
    <div className="border rounded-md p-2">
      <div className="relative">
        <div className="absolute top-2 left-2.5">
          <Calendar className="h-4 w-4 opacity-70" />
        </div>
        <div className="ml-8">
          <DayPicker
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            pagedNavigation
            className="border-none shadow-none p-3 pointer-events-auto"
          />
        </div>
      </div>
    </div>
  );
}

import { DayPicker } from "react-day-picker";
