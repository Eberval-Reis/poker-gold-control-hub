
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import { ScheduleEvent } from "@/hooks/useScheduleEvents";
import { Check, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { tournamentService } from "@/services/tournament.service";
import { QuickEventModal } from "./QuickEventModal";
import { useAgendaEventList } from "@/hooks/useAgendaEventList";
import { EventDropdown } from "./EventDropdown";
import { TournamentDropdown } from "./TournamentDropdown";

interface EventFormFields extends Omit<ScheduleEvent, "id"> {
  eventId: string;
  eventName?: string | null;
}

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

  // Ao cadastrar evento rápido, seleciona o recém-cadastrado
  const handleAddQuickEvent = (eventoSalvo: { id: string; name: string; date?: string | null }) => {
    setValue("eventId", eventoSalvo.id);
    setValue("eventName", eventoSalvo.name);
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
  } = useForm<EventFormFields>({
    defaultValues: initialData
      ? {
          ...initialData,
          eventId: initialData.eventId ?? "",
          eventName: initialData.eventName ?? "",
        }
      : {
          eventId: "",
          eventName: "",
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

  // Atualiza tournamentName quando tournamentId muda
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

  const submit = (data: EventFormFields) => {
    if (!validateUnique(data)) {
      alert("Evento já cadastrado para este torneio nesta data e horário.");
      return;
    }
    const eventDate = new Date(data.date + "T" + data.time);
    if (eventDate < new Date()) {
      alert("Data/hora deve ser futura.");
      return;
    }

    // Assegura que os campos buyIn e rebuys são números
    const buyIn = typeof data.buyIn === "string" ? parseFloat(data.buyIn) : data.buyIn;
    const rebuys = typeof data.rebuys === "string" ? parseInt(data.rebuys as any, 10) : data.rebuys;

    onSubmit({
      ...data,
      buyIn: isNaN(buyIn) ? 0 : buyIn,
      rebuys: isNaN(rebuys) ? 0 : rebuys,
      eventId: data.eventId,
      eventName: data.eventName,
    } as Omit<ScheduleEvent, "id">);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-card p-4 rounded-lg flex flex-col gap-2 animate-fade-in border border-poker-gold/10 max-w-md mx-auto"
    >
      {/* Campo Evento (dropdown base evento) */}
      <div className="flex gap-2 items-end mb-1">
        <div className="flex-1">
          <label className="block text-poker-gold font-semibold mb-1">Evento</label>
          <Controller
            name="eventId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <EventDropdown
                events={agendaEvents}
                value={field.value}
                onChange={(eventId, eventName) => {
                  field.onChange(eventId);
                  setValue("eventName", eventName || "");
                }}
                disabled={loadingAgenda}
              />
            )}
          />
          {errors.eventId && (
            <span className="text-red-500 text-xs">Selecione um evento</span>
          )}
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

      {/* Campo Torneio (dropdown base torneio) */}
      <div>
        <label className="block text-poker-gold font-semibold mb-1">Nome do Torneio</label>
        <Controller
          name="tournamentId"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TournamentDropdown
              tournaments={tournaments}
              value={field.value}
              onChange={(id, name) => {
                field.onChange(id);
                setValue("tournamentName", name);
              }}
              error={Boolean(errors.tournamentId)}
            />
          )}
        />
        {errors.tournamentId && (
          <span className="text-red-500 text-xs">{errors.tournamentId.message}</span>
        )}
      </div>
      {/* Campos restantes */}
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
