
import React, { useState, useMemo } from "react";
import { Plus, List, Grid2x2 } from "lucide-react";
import { EventForm } from "@/components/schedule/EventForm";
import { EventCard } from "@/components/schedule/EventCard";
import { useScheduleEvents, ScheduleEvent } from "@/hooks/useScheduleEvents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

type FilterStatus = "all" | "done" | "not_done";

const SchedulePage = () => {
  const { events, addEvent, deleteEvent, updateEvent } = useScheduleEvents();
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState<ScheduleEvent | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filtra e ordena eventos para exibição
  const filteredEvents = useMemo(() => {
    return events
      .filter((e) =>
        filterStatus === "all"
          ? true
          : filterStatus === "done"
          ? e.status === "done"
          : e.status === "not_done"
      )
      .filter((e) =>
        e.tournamentName.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        a.date + "T" + a.time > b.date + "T" + b.time ? 1 : -1
      );
  }, [events, filterStatus, search]);

  // Adicionar ou editar evento
  function handleSave(ev: Omit<ScheduleEvent, "id">) {
    if (editEvent) {
      updateEvent(editEvent.id, ev);
      toast({
        title: "Evento atualizado",
      });
    } else {
      addEvent({ ...ev, id: crypto.randomUUID() });
      toast({
        title: "Evento cadastrado",
      });
    }
    setShowForm(false);
    setEditEvent(null);
  }

  // Toggle Cumprido/Não cumprido
  function handleToggleStatus(ev: ScheduleEvent) {
    if (ev.status === "done") {
      updateEvent(ev.id, { status: "not_done" });
      toast({ title: "Marcado como não cumprido" });
    } else {
      updateEvent(ev.id, { status: "done", reason: "" });
      toast({ title: "Cumprido com sucesso!" });
    }
  }

  // Motivo para não cumprido
  function handleChangeReason(id: string, reason: string) {
    updateEvent(id, { reason, status: "not_done" });
  }

  function handleDelete(id: string) {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este evento da sua agenda?"
      )
    ) {
      deleteEvent(id);
      toast({ title: "Evento excluído" });
    }
  }

  // Layout do filtro de status e modo de visualização
  const FilterBar = (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between mb-4">
      <div className="flex gap-2">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
        >
          Todos
        </Button>
        <Button
          variant={filterStatus === "done" ? "default" : "outline"}
          onClick={() => setFilterStatus("done")}
        >
          <span className="text-green-400">✔️</span> Cumpridos
        </Button>
        <Button
          variant={filterStatus === "not_done" ? "default" : "outline"}
          onClick={() => setFilterStatus("not_done")}
        >
          <span className="text-red-400">❌</span> Não Cumpridos
        </Button>
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <Input
          placeholder="Buscar por torneio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48"
        />
        <Button
          size="icon"
          variant={viewMode === "grid" ? "default" : "ghost"}
          onClick={() => setViewMode("grid")}
        >
          <Grid2x2 />
        </Button>
        <Button
          size="icon"
          variant={viewMode === "list" ? "default" : "ghost"}
          onClick={() => setViewMode("list")}
        >
          <List />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 relative">
      <h1 className="text-2xl font-bold text-poker-gold mb-2">Agenda de Eventos</h1>
      <p className="mb-6 text-gray-400">
        Gerencie seus agendamentos de torneios de poker de forma visual e prática.
      </p>
      {FilterBar}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            : "flex flex-col gap-4"
        }
      >
        {filteredEvents.length === 0 ? (
          <div className="text-center text-gray-400 bg-[#171717] rounded-lg p-8 shadow animate-fade-in">
            <p>Nenhum evento agendado encontrado.</p>
            <p>
              Clique no botão <span className="text-poker-gold font-bold">+</span> para adicionar!
            </p>
          </div>
        ) : (
          filteredEvents.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              onEdit={(ev) => {
                setEditEvent(ev);
                setShowForm(true);
              }}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onChangeReason={handleChangeReason}
            />
          ))
        )}
      </div>
      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          <div className="relative">
            <EventForm
              onSubmit={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditEvent(null);
              }}
              initialData={editEvent}
              existingEvents={events}
            />
          </div>
        </div>
      )}
      {/* Botão flutuante de adicionar */}
      <Button
        className="fixed bottom-8 right-8 bg-poker-gold text-white hover:bg-poker-gold/90 rounded-full p-0 size-16 shadow-lg text-3xl flex items-center justify-center z-50 animate-scale-in"
        onClick={() => {
          setEditEvent(null);
          setShowForm(true);
        }}
      >
        <Plus size={34} />
      </Button>
    </div>
  );
};

export default SchedulePage;
