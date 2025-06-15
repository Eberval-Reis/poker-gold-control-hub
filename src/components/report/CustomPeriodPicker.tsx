
import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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
}) => (
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
        <div className="border rounded-md p-2">
          <div className="relative">
            <div className="absolute top-2 left-2.5">
              <Calendar className="h-4 w-4 opacity-70" />
            </div>
            <div className="ml-8">
              <DayPicker
                mode="range"
                defaultMonth={startDate}
                selected={startDate && endDate ? { from: startDate, to: endDate } : undefined}
                onSelect={(date: DateRange | undefined) => {
                  setStartDate(date?.from);
                  setEndDate(date?.to);
                }}
                numberOfMonths={2}
                pagedNavigation
                className="border-none shadow-none p-3 pointer-events-auto"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
);

export default CustomPeriodPicker;
