import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useForm, Controller } from "react-hook-form";
import { ScheduleEvent } from "@/hooks/useScheduleEvents";
import { Check, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { tournamentService } from "@/services/tournament.service";
import { QuickEventModal } from "./QuickEventModal";
import { useAgendaEventList } from "@/hooks/useAgendaEventList";

interface EventFormProps {
  onSubmit: (event: Omit<ScheduleEvent, "id">) => void;
  onCancel: () => void;
  initialData?: ScheduleEvent | null;
  existingEvents: ScheduleEvent[];
}

export const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  existingEvents,
}) => {
  // -------- INTEGRAÇÃO BASE DE DADOS --------
  const { events: agendaEvents, loading: loadingAgenda } = useAgendaEventList();
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [selectedQuick, setSelectedQuick] = useState("");

  // Atualiza sempre que há evento novo cadastrado
  const handleAddQuickEvent = (e: { id: string; name: string; date: string }) => {
    setSelectedQuick(e.name); // Seleciona imediatamente o novo evento pelo nome
    // Poderia haver um refetch de eventos se usar react-query ou um custom hook para recarregar se preferir.
    // Como useAgendaEventList faz o fetch no mount, só recarrega ao dar refresh na página, mas para este contexto funciona.
  };

  // Torneios vindos do banco
  const { data: tournaments = [] } = useQuery({
    queryKey: ["tournaments"],
    queryFn: tournamentService.getTournaments,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Omit<ScheduleEvent, "id">>({
    defaultValues: initialData || {
      tournamentId: "",
      tournamentName: "",
      date: "",
      time: "",
      buyIn: 0,
      rebuys: 0,
      status: "pending",
      reason: "",
    },
  });

  useEffect(() => {
    const selectedId = watch("tournamentId");
    const found = tournaments?.find((t: any) => t.id === selectedId);
    if (found) setValue("tournamentName", found.name);
    // eslint-disable-next-line
  }, [watch("tournamentId"), tournaments]);

  function validateUnique(data: Omit<ScheduleEvent, "id">) {
    return (
      !existingEvents.some(
        (ev) =>
          ev.tournamentId === data.tournamentId &&
          ev.date === data.date &&
          ev.time === data.time &&
          (!initialData || ev.id !== initialData.id)
      )
    );
  }

  const submit = (data: Omit<ScheduleEvent, "id">) => {
    if (!validateUnique(data)) {
      alert("Evento já cadastrado para este torneio nesta data e horário.");
      return;
    }
    const eventDate = new Date(data.date + "T" + data.time);
    if (eventDate < new Date()) {
      alert("Data/hora deve ser futura.");
      return;
    }
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-card p-4 rounded-lg flex flex-col gap-2 animate-fade-in border border-poker-gold/10 max-w-md mx-auto"
    >
      {/* Campo Evento com ícone */}
      <div className="flex gap-2 items-end mb-1">
        <div className="flex-1">
          <label className="block text-poker-gold font-semibold mb-1">Evento</label>
          <select
            value={selectedQuick}
            onChange={e => setSelectedQuick(e.target.value)}
            className={cn(
              "w-full rounded p-2 text-white bg-background border border-input outline-none"
            )}
          >
            <option value="">Selecione...</option>
            {agendaEvents.map((ev) => (
              <option key={ev.id} value={ev.name}>
                {ev.name} {ev.date ? `(${ev.date})` : ""}
              </option>
            ))}
          </select>
        </div>
        <Button type="button" variant="outline" size="icon" onClick={() => setQuickModalOpen(true)}>
          <Plus className="text-poker-gold" />
        </Button>
      </div>

      <QuickEventModal
        open={quickModalOpen}
        onOpenChange={setQuickModalOpen}
        onAddEvent={handleAddQuickEvent}
      />

      {/* Campo Torneio já existente */}
      <div>
        <label className="block text-poker-gold font-semibold mb-1">Nome do Torneio</label>
        <select
          {...register("tournamentId", { required: true })}
          className={cn(
            "w-full rounded p-2 text-white bg-background border border-input outline-none",
            errors.tournamentId && "border-red-500"
          )}
        >
          <option value="">Selecione...</option>
          {tournaments.map((t: any) => (
            <option value={t.id} key={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-poker-gold font-semibold mb-1">Data</label>
          <Controller
            name="date"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                onDateChange={(d) => field.onChange(d?.toISOString().slice(0, 10) ?? "")}
                placeholder="Escolha a data"
                className={cn(errors.date && "border-red-400")}
              />
            )}
          />
        </div>
        <div className="flex-1">
          <label className="block text-poker-gold font-semibold mb-1">Hora</label>
          <Input
            type="time"
            {...register("time", { required: true })}
            className={cn(errors.time && "border-red-400")}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-poker-gold font-semibold mb-1">Valor do Buy-in</label>
          <Input
            type="number"
            step="0.01"
            min={0}
            {...register("buyIn", { required: true, min: 0 })}
            className={cn(errors.buyIn && "border-red-400")}
          />
        </div>
        <div className="flex-1">
          <label className="block text-poker-gold font-semibold mb-1">Rebuys</label>
          <Input
            type="number"
            min={0}
            defaultValue={0}
            {...register("rebuys", { required: true, min: 0 })}
            className={cn(errors.rebuys && "border-red-400")}
          />
        </div>
      </div>
      <div className="flex gap-2 items-center mt-2">
        <label className="text-poker-gold">Cumprido?</label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Switch
              checked={field.value === "done"}
              onCheckedChange={(checked) =>
                field.onChange(checked ? "done" : "pending")
              }
              className={field.value === "done" ? "bg-green-600" : ""}
            />
          )}
        />
        {watch("status") === "done" && (
          <Check className="ml-2 text-green-500" />
        )}
        {watch("status") === "not_done" && (
          <X className="ml-2 text-red-500" />
        )}
      </div>
      {watch("status") === "not_done" && (
        <div>
          <label className="block text-poker-gold font-semibold mb-1">Motivo</label>
          <Input {...register("reason")} />
        </div>
      )}
      <div className="flex gap-2 justify-end mt-2">
        <Button onClick={onCancel} type="button" variant="outline">
          Cancelar
        </Button>
        <Button className="bg-poker-gold hover:bg-poker-gold/90 text-white" type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
};
