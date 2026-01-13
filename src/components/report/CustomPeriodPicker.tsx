
import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";

interface CustomPeriodPickerProps {
  startDate?: Date;
  setStartDate: (date?: Date) => void;
  endDate?: Date;
  setEndDate: (date?: Date) => void;
}

const CustomPeriodPicker: React.FC<CustomPeriodPickerProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const formatDateRange = () => {
    if (!startDate) return null;
    const start = format(startDate, "dd/MM/yyyy", { locale: ptBR });
    if (!endDate) return start;
    const end = format(endDate, "dd/MM/yyyy", { locale: ptBR });
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="data" className="text-base font-medium">Período Personalizado</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full sm:w-[320px] justify-start text-left font-normal h-11 text-base border-border bg-background hover:bg-accent/50",
              !startDate && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-3 h-4 w-4 text-primary" />
            {formatDateRange() || <span>Selecione as datas</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
          <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b border-border">
              <p className="text-sm font-medium text-foreground">Selecione o intervalo de datas</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDateRange() || "Clique para selecionar início e fim"}
              </p>
            </div>
            <DayPicker
              mode="range"
              defaultMonth={startDate || new Date()}
              selected={startDate && endDate ? { from: startDate, to: endDate } : startDate ? { from: startDate, to: undefined } : undefined}
              onSelect={(range: DateRange | undefined) => {
                setStartDate(range?.from);
                setEndDate(range?.to);
              }}
              numberOfMonths={2}
              pagedNavigation
              locale={ptBR}
              className="p-4 pointer-events-auto"
              classNames={{
                months: "flex flex-col sm:flex-row gap-4",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
                caption_label: "text-foreground font-semibold",
                nav: "flex items-center gap-1",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-md transition-colors",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                day_range_start: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_range_end: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-semibold",
                day_outside: "text-muted-foreground/40",
                day_disabled: "text-muted-foreground/40",
                day_range_middle: "bg-primary/20 text-foreground rounded-none",
                day_hidden: "invisible",
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomPeriodPicker;
