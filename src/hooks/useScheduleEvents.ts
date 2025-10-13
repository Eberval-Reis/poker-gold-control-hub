
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService, TournamentSchedule } from "@/services/schedule.service";
import { toast } from "sonner";

export type ScheduleEventStatus = "pending" | "done" | "not_done";

export interface ScheduleEvent {
  id: string;
  tournamentId: string;
  tournamentName: string;
  date: string;
  time: string;
  buyIn: number;
  rebuys: number;
  status: ScheduleEventStatus;
  reason?: string;
  eventId?: string;
  eventName?: string | null;
}

// Função de conversão de TournamentSchedule para ScheduleEvent
function convertToScheduleEvent(schedule: TournamentSchedule): ScheduleEvent {
  return {
    id: schedule.id,
    tournamentId: schedule.tournament_id,
    tournamentName: schedule.tournament_name,
    date: schedule.date,
    time: schedule.time,
    buyIn: Number(schedule.buy_in),
    rebuys: Number(schedule.rebuys),
    status: schedule.status,
    reason: schedule.reason || undefined,
    eventId: schedule.event_id || undefined,
    eventName: schedule.event_name,
  };
}

// Função de conversão de ScheduleEvent para TournamentSchedule
function convertToTournamentSchedule(event: Omit<ScheduleEvent, "id">): Omit<TournamentSchedule, "id" | "user_id" | "created_at" | "updated_at"> {
  return {
    event_id: event.eventId || null,
    event_name: event.eventName || null,
    tournament_id: event.tournamentId,
    tournament_name: event.tournamentName,
    date: event.date,
    time: event.time,
    buy_in: event.buyIn,
    rebuys: event.rebuys,
    status: event.status,
    reason: event.reason || null,
  };
}

export function useScheduleEvents() {
  const queryClient = useQueryClient();

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ["tournament-schedules"],
    queryFn: scheduleService.getSchedules,
  });

  const events = schedules.map(convertToScheduleEvent);

  const createMutation = useMutation({
    mutationFn: (event: Omit<ScheduleEvent, "id">) => 
      scheduleService.createSchedule(convertToTournamentSchedule(event)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament-schedules"] });
      toast.success("Agendamento criado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar agendamento");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, update }: { id: string; update: Partial<ScheduleEvent> }) => {
      const updateData: Partial<TournamentSchedule> = {};
      if (update.tournamentId) updateData.tournament_id = update.tournamentId;
      if (update.tournamentName) updateData.tournament_name = update.tournamentName;
      if (update.date) updateData.date = update.date;
      if (update.time) updateData.time = update.time;
      if (update.buyIn !== undefined) updateData.buy_in = update.buyIn;
      if (update.rebuys !== undefined) updateData.rebuys = update.rebuys;
      if (update.status) updateData.status = update.status;
      if (update.reason !== undefined) updateData.reason = update.reason || null;
      if (update.eventId !== undefined) updateData.event_id = update.eventId || null;
      if (update.eventName !== undefined) updateData.event_name = update.eventName || null;
      
      return scheduleService.updateSchedule(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament-schedules"] });
      toast.success("Agendamento atualizado!");
    },
    onError: () => {
      toast.error("Erro ao atualizar agendamento");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: scheduleService.deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament-schedules"] });
      toast.success("Agendamento excluído!");
    },
    onError: () => {
      toast.error("Erro ao excluir agendamento");
    },
  });

  const addEvent = (event: Omit<ScheduleEvent, "id">) => {
    createMutation.mutate(event);
  };

  const updateEvent = (id: string, update: Partial<ScheduleEvent>) => {
    updateMutation.mutate({ id, update });
  };

  const deleteEvent = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    setEvents: () => {}, // Manter compatibilidade mas não faz nada
    isLoading,
  };
}
