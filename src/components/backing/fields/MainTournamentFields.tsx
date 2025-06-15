
import React from "react";
import { Pen } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AgendaEvent } from "@/hooks/useAgendaEventList";
import { Torneio } from "@/hooks/useTorneioList";

interface MainTournamentFieldsProps {
  selectedEvento: string;
  setSelectedEvento: (v: string) => void;
  agendaEvents: AgendaEvent[];
  loadingAgenda: boolean;
  onEditClick: (id: string, name: string) => void;
  selectedTorneio: string;
  setSelectedTorneio: (v: string) => void;
  torneios: Torneio[];
  loadingTorneios: boolean;
  buyIn: string;
  setBuyIn: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
}

export default function MainTournamentFields({
  selectedEvento,
  setSelectedEvento,
  agendaEvents,
  loadingAgenda,
  onEditClick,
  selectedTorneio,
  setSelectedTorneio,
  torneios,
  loadingTorneios,
  buyIn,
  setBuyIn,
  date,
  setDate
}: MainTournamentFieldsProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      {/* Select Evento da Agenda */}
      <div className="flex-1 min-w-[180px]">
        <label className="block text-poker-gold font-semibold mb-1">
          Evento da Agenda
        </label>
        <Select
          value={selectedEvento}
          onValueChange={setSelectedEvento}
          disabled={loadingAgenda}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={loadingAgenda ? "Carregando..." : "Selecione..."}
            />
          </SelectTrigger>
          <SelectContent>
            {agendaEvents.length === 0 && !loadingAgenda && (
              <div className="px-4 py-2 text-muted-foreground text-sm">
                Nenhum evento encontrado
              </div>
            )}
            {agendaEvents.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between pr-1">
                <SelectItem value={ev.id} className="flex-1">
                  {ev.name}
                </SelectItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-poker-gold ml-1"
                  title="Editar evento"
                  onClick={(e) => { e.stopPropagation(); onEditClick(ev.id, ev.name); }}
                  tabIndex={-1}
                >
                  <Pen size={16} />
                </Button>
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Select Nome do Torneio */}
      <div className="flex-1 min-w-[180px]">
        <label className="block text-poker-gold font-semibold mb-1">
          Nome do Torneio *
        </label>
        <Select
          value={selectedTorneio}
          onValueChange={setSelectedTorneio}
          disabled={loadingTorneios}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={loadingTorneios ? "Carregando..." : "Selecione..."}
            />
          </SelectTrigger>
          <SelectContent>
            {torneios.map((torneio) => (
              <SelectItem key={torneio.id} value={torneio.id}>
                {torneio.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[150px]">
        <label className="block text-poker-gold font-semibold mb-1">
          Buy-in (R$) *
        </label>
        <input
          required
          type="number"
          step="0.01"
          className="w-full p-2 rounded border border-input bg-background text-base"
          placeholder="Valor do buy-in"
          value={buyIn}
          onChange={e => setBuyIn(e.target.value)}
        />
      </div>
      <div className="flex-1 min-w-[140px]">
        <label className="block text-poker-gold font-semibold mb-1">
          Data *
        </label>
        <input
          type="date"
          required
          className="w-full p-2 rounded border border-input bg-background text-base"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
    </div>
  );
}
