
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ReportType } from "@/hooks/useReportData";

const REPORT_TYPE_OPTIONS = [
  { label: "Desempenho", value: "performance" },
  { label: "Despesas", value: "expenses" },
  { label: "Financeiro", value: "financial" },
  { label: "ROI", value: "roi" },
  { label: "Comparativo", value: "comparison" },
];

export interface ReportTypeSelectProps {
  reportType: ReportType;
  setReportType: (reportType: ReportType) => void;
}

const ReportTypeSelect: React.FC<ReportTypeSelectProps> = ({
  reportType,
  setReportType,
}) => (
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
);

export default ReportTypeSelect;
