
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PeriodType, ReportType } from "@/hooks/useReportData";
import ReportTypeSelect from "./ReportTypeSelect";
import PeriodSelect from "./PeriodSelect";
import CustomPeriodPicker from "./CustomPeriodPicker";
import ComparisonDatesFields from "./ComparisonDatesFields";
import EventTournamentFilters from "./EventTournamentFilters";

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
  // DRE filters
  eventId?: string;
  setEventId?: (id?: string) => void;
  tournamentId?: string;
  setTournamentId?: (id?: string) => void;
}

const ReportConfigForm: React.FC<ReportConfigFormProps> = ({
  period, setPeriod,
  reportType, setReportType,
  startDate, setStartDate,
  endDate, setEndDate,
  onGenerate,
  formError,
  comparisonStart, setComparisonStart,
  comparisonEnd, setComparisonEnd,
  eventId, setEventId,
  tournamentId, setTournamentId,
}) => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onGenerate();
      }}
      className="space-y-5 mb-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-end">
        <div className="flex flex-col gap-3 w-full sm:flex-row sm:w-auto flex-1">
          <ReportTypeSelect reportType={reportType} setReportType={setReportType} />
          <PeriodSelect period={period} setPeriod={setPeriod} />
        </div>
        <div className="w-full sm:w-auto">
          <Button
            type="submit"
            className="w-full sm:w-auto bg-poker-gold text-white font-semibold h-11 text-base px-6"
          >
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Filtros de Evento/Torneio para DRE */}
      {reportType === "dre" && setEventId && setTournamentId && (
        <EventTournamentFilters
          eventId={eventId}
          setEventId={setEventId}
          tournamentId={tournamentId}
          setTournamentId={setTournamentId}
        />
      )}

      {reportType === "comparison" && (
        <ComparisonDatesFields
          comparisonStart={comparisonStart}
          setComparisonStart={setComparisonStart}
          comparisonEnd={comparisonEnd}
          setComparisonEnd={setComparisonEnd}
        />
      )}

      {period === "custom" && (
        <CustomPeriodPicker 
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      )}

      {formError && (
        <div className="text-red-700 mt-2">{formError}</div>
      )}
    </form>
  );
}

export default ReportConfigForm;
