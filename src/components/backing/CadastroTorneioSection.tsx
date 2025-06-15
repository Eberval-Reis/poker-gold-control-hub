
import React from "react";
import { Pen } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTorneioList } from "@/hooks/useTorneioList";
import { useAgendaEventList } from "@/hooks/useAgendaEventList";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const CadastroTorneioSection = () => {
  // Estados dos campos de formulário
  const [playerName, setPlayerName] = React.useState("");
  const [cavEnable, setCavEnable] = React.useState(false);
  const [selectedTorneio, setSelectedTorneio] = React.useState<string>("");
  const [selectedEvento, setSelectedEvento] = React.useState<string>("");
  const [buyIn, setBuyIn] = React.useState<string>("");
  const [date, setDate] = React.useState<string>("");
  const [maxPercent, setMaxPercent] = React.useState<string>("80");
  const [markup, setMarkup] = React.useState<string>("1.5");

  const { torneios, loading: loadingTorneios } = useTorneioList();
  const { events: agendaEvents, loading: loadingAgenda } = useAgendaEventList();
  const [editModal, setEditModal] = React.useState<{ open: boolean; eventId: string | null }>({ open: false, eventId: null });
  const [editValue, setEditValue] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  // Função: Abre modal e preenche com nome do evento escolhido
  const handleEditClick = (eventId: string, eventName: string) => {
    setEditModal({ open: true, eventId });
    setEditValue(eventName);
  };

  // Função: Salvar nome editado
  async function handleSaveEdit() {
    if (!editModal.eventId) return;
    setSaving(true);
    const { error } = await supabase
      .from("schedule_events")
      .update({ name: editValue })
      .eq("id", editModal.eventId);
    setSaving(false);
    setEditModal({ open: false, eventId: null });
    window.location.reload();
  }

  // Função para salvar o cadastro do torneio/backing_offer
  async function handleSalvarTorneio(e: React.FormEvent) {
    e.preventDefault();
    // Validações
    if (!playerName.trim() || !selectedTorneio || !buyIn || !date) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }
    if (cavEnable && (Number(maxPercent) < 5 || Number(maxPercent) > 80)) {
      toast({ title: "Percentual para venda deve ser entre 5% e 80%", variant: "destructive" });
      return;
    }
    if (cavEnable && Number(markup) < 1) {
      toast({ title: "O mark-up deve ser igual ou maior que 1", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      // Cria backing_offer
      const { error } = await supabase.from("backing_offers").insert({
        tournament_id: selectedTorneio,
        player_name: playerName,
        buy_in_amount: Number(buyIn),
        tournament_date: date,
        available_percentage: cavEnable ? Number(maxPercent) : 0,
        markup_percentage: cavEnable ? Number(markup) : 1,
        status: "open",
      });
      if (error) throw error;
      toast({ title: "Torneio cadastrado com sucesso!" });
      // Limpa campos
      setPlayerName("");
      setSelectedTorneio("");
      setSelectedEvento("");
      setBuyIn("");
      setDate("");
      setMaxPercent("80");
      setMarkup("1.5");
      setCavEnable(false);
    } catch (err: any) {
      toast({ title: "Erro ao cadastrar torneio", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-semibold">Cadastro do Torneio</h2>
      <form className="space-y-4" onSubmit={handleSalvarTorneio}>
        {/* Linha dos campos principais */}
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
                      onClick={(e) => { e.stopPropagation(); handleEditClick(ev.id, ev.name); }}
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
        <div>
          <label className="block text-poker-gold font-semibold mb-1">
            Nome do Jogador *
          </label>
          <input
            type="text"
            required
            className="w-full p-2 rounded border border-input bg-background text-base"
            placeholder="Quem será financiado"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
          />
        </div>
        {/* Switch e grupo de cavalagem */}
        <div className="flex items-center gap-3 mt-3">
          <Switch checked={cavEnable} onCheckedChange={setCavEnable} />
          <span className="font-medium text-gray-800">
            Habilitar Cavalagem?
          </span>
        </div>
        {cavEnable && (
          <div className="mt-4 p-4 bg-muted rounded-lg flex gap-4 flex-col md:flex-row">
            <div className="flex-1">
              <label className="block text-poker-gold font-semibold mb-1">
                % Máxima para Venda
              </label>
              <input
                type="number"
                required
                min={5}
                max={80}
                className="w-full p-2 rounded border border-input bg-background text-base"
                placeholder="Ex: 80"
                value={maxPercent}
                onChange={e => setMaxPercent(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-poker-gold font-semibold mb-1">
                Mark-up Padrão
              </label>
              <input
                type="number"
                required
                min={1}
                step="0.01"
                className="w-full p-2 rounded border border-input bg-background text-base"
                placeholder="Ex: 1.5"
                value={markup}
                onChange={e => setMarkup(e.target.value)}
              />
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <button
            className="bg-poker-gold text-white px-6 py-2 rounded hover:bg-poker-gold/90 font-bold"
            type="submit"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
      {/* Modal simples de edição */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-[90vw] max-w-xs shadow space-y-3 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              type="button"
              onClick={() => setEditModal({ open: false, eventId: null })}
              aria-label="Fechar"
            >
              ×
            </button>
            <h3 className="mb-2 text-lg font-semibold text-poker-gold">Editar Evento</h3>
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 mb-2"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline"
                onClick={() => setEditModal({ open: false, eventId: null })}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                className="bg-poker-gold text-white"
                onClick={handleSaveEdit}
                disabled={saving || !editValue}
              >
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroTorneioSection;
