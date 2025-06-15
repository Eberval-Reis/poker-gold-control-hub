import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface ReportConfigFormProps {
  period: string;
  setPeriod: (period: string) => void;
  reportType: string;
  setReportType: (reportType: string) => void;
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

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onGenerate();
      }}
      className="space-y-4"
    >
      {/* Seletor de tipo de relatório */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Tipo de Relatório</label>
        <select
          className="border rounded px-2 py-1"
          value={reportType}
          onChange={e => setReportType(e.target.value as any)}
        >
          {REPORT_TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Inputs customizados para relatório comparativo */}
      {reportType === "comparison" ? (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div>
              <label className="text-xs font-semibold">Período A - Início</label>
              <input type="date" value={comparisonStart ? comparisonStart.toISOString().slice(0,10) : ''}
                onChange={e => setComparisonStart?.(e.target.value ? new Date(e.target.value) : undefined)}
                className="border rounded px-2 py-1" />
            </div>
            <div>
              <label className="text-xs font-semibold">Período A - Fim</label>
              <input type="date" value={comparisonEnd ? comparisonEnd.toISOString().slice(0,10) : ''}
                onChange={e => setComparisonEnd?.(e.target.value ? new Date(e.target.value) : undefined)}
                className="border rounded px-2 py-1" />
            </div>
            {/* Período B pode ser os campos padrão do formulário existentes */}
          </div>
        </>
      ) : null}

      {/* Seletor de período */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Período</label>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Semana Atual</SelectItem>
            <SelectItem value="month">Mês Atual</SelectItem>
            <SelectItem value="quarter">Trimestre Atual</SelectItem>
            <SelectItem value="year">Ano Atual</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Picker (Custom Period) */}
      {period === "custom" && (
        <div className="space-y-2">
          <Label htmlFor="data">Período</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
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
              {/* @ts-expect-error */}
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
      <button
        type="submit"
        className="bg-poker-green text-white font-semibold py-2 px-4 rounded hover:bg-green-600"
      >
        Gerar Relatório
      </button>
      {formError && (
        <div className="text-red-700 mt-2">{formError}</div>
      )}
    </form>
  );
}

export default ReportConfigForm;

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
          {/* @ts-expect-error */}
          <ReactDayPicker
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            pagedNavigation
            className="border-none shadow-none"
          />
        </div>
      </div>
    </div>
  );
}

import ReactDayPicker from "react-day-picker";
