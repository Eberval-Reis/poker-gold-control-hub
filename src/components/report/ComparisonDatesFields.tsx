
import React from "react";

interface ComparisonDatesFieldsProps {
  comparisonStart?: Date;
  setComparisonStart?: (date?: Date) => void;
  comparisonEnd?: Date;
  setComparisonEnd?: (date?: Date) => void;
}

const ComparisonDatesFields: React.FC<ComparisonDatesFieldsProps> = ({
  comparisonStart,
  setComparisonStart,
  comparisonEnd,
  setComparisonEnd,
}) => (
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
);

export default ComparisonDatesFields;
