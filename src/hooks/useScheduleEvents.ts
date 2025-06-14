
import { useState, useEffect } from "react";

export type ScheduleEventStatus = "pending" | "done" | "not_done";

export interface ScheduleEvent {
  id: string;
  tournamentId: string;
  tournamentName: string;
  date: string; // ISO string
  time: string; // "HH:mm"
  buyIn: number;
  rebuys: number;
  status: ScheduleEventStatus;
  reason?: string;
  eventId?: string;      // <-- allow optional eventId (for agenda event association)
  eventName?: string | null; // <-- allow optional eventName
}

const STORAGE_KEY = "poker_schedule_events_v1";

function getEventsFromStorage(): ScheduleEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveEventsToStorage(events: ScheduleEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function useScheduleEvents() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    setEvents(getEventsFromStorage());
  }, []);

  useEffect(() => {
    saveEventsToStorage(events);
  }, [events]);

  const addEvent = (event: ScheduleEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const updateEvent = (id: string, update: Partial<ScheduleEvent>) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, ...update } : evt))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    setEvents,
  };
}
