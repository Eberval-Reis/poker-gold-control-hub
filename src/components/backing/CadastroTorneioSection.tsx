import React from "react";
import { Pen } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import PlayerInfoFields from "./fields/PlayerInfoFields";
import MainTournamentFields from "./fields/MainTournamentFields";
import CavFields from "./fields/CavFields";
import { useTorneioList } from "@/hooks/useTorneioList";
import { useAgendaEventList } from "@/hooks/useAgendaEventList";
import { supabase } from "@/integrations/supabase/client";

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

  const { torneios, loading: loadingTorneios } = useTorneioList({ eventId: selectedEvento });
  const { events: agendaEvents, loading: loadingAgenda } = useAgendaEventList();

  // Efeito para carregar o nome do usuário logado
  React.useEffect(() => {
    const loadUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name 
          || user.user_metadata?.name 
          || user.email?.split('@')[0] 
          || '';
        setPlayerName(name);
      }
    };
    loadUserName();
  }, []);

  // Efeito para preencher automaticamente o buy-in e data quando um torneio é selecionado
  React.useEffect(() => {
    if (selectedTorneio) {
      const torneio = torneios.find(t => t.id === selectedTorneio);
      if (torneio) {
        if (torneio.buyin_amount) {
          setBuyIn(torneio.buyin_amount.toString());
        }
        if (torneio.date) {
          setDate(torneio.date);
        }
      }
    }
  }, [selectedTorneio, torneios]);

  // Efeito para limpar a seleção de torneio quando o evento mudar
  React.useEffect(() => {
    setSelectedTorneio("");
    setBuyIn("");
  }, [selectedEvento]);
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
    
    // Obter o usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      toast({ title: "Erro de autenticação", description: "Você precisa estar logado", variant: "destructive" });
      return;
    }
    
    // Validações
    if (!playerName.trim() || !selectedTorneio || !buyIn || !date) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }
    if (cavEnable && (Number(maxPercent) < 5 || Number(maxPercent) > 80)) {
      toast({ title: "Percentual para venda deve ser entre 5% e 80%", variant: "destructive" });
      return;
    }
    // Markup é opcional - usa 1 como padrão se não informado
    setSaving(true);
    try {
      // Cria backing_offer
      const { error } = await supabase.from("backing_offers").insert({
        tournament_id: selectedTorneio,
        player_name: playerName,
        buy_in_amount: Number(buyIn),
        tournament_date: date,
        available_percentage: cavEnable ? Number(maxPercent) : 0,
        markup_percentage: cavEnable && markup ? Number(markup) : 1,
        status: "open",
        user_id: user.id,
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
    <div className="space-y-5 max-w-full w-full mx-auto px-0 sm:px-2 overflow-x-hidden">
      <h2 className="text-lg sm:text-xl font-semibold text-center sm:text-left">Cadastro do Torneio</h2>
      <form 
        className="space-y-3 sm:space-y-4"
        onSubmit={handleSalvarTorneio}
        style={{ maxWidth: '100%', width: '100%' }}
      >
        <MainTournamentFields
          selectedEvento={selectedEvento}
          setSelectedEvento={setSelectedEvento}
          agendaEvents={agendaEvents}
          loadingAgenda={loadingAgenda}
          onEditClick={handleEditClick}
          selectedTorneio={selectedTorneio}
          setSelectedTorneio={setSelectedTorneio}
          torneios={torneios}
          loadingTorneios={loadingTorneios}
          buyIn={buyIn}
          setBuyIn={setBuyIn}
          date={date}
          setDate={setDate}
        />

        <PlayerInfoFields playerName={playerName} setPlayerName={setPlayerName} />

        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <Switch checked={cavEnable} onCheckedChange={setCavEnable} />
          <span className="font-medium text-gray-800 text-sm sm:text-base">
            Habilitar Cavalagem?
          </span>
        </div>
        {cavEnable && (
          <CavFields maxPercent={maxPercent} setMaxPercent={setMaxPercent} markup={markup} setMarkup={setMarkup} />
        )}
        <div className="flex gap-3 mt-4">
          <button
            className="bg-poker-gold text-white px-4 sm:px-6 py-2 rounded hover:bg-poker-gold/90 font-bold w-full sm:w-auto text-base sm:text-base"
            type="submit"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
      {/* Modal de edição de evento */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-[94vw] max-w-xs shadow space-y-3 relative">
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
