
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { PeriodType } from "@/hooks/useReportData";

export interface PeriodSelectProps {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
}

const PeriodSelect: React.FC<PeriodSelectProps> = ({
  period,
  setPeriod,
}) => (
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
);

export default PeriodSelect;
