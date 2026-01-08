import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import PlayerInfoFields from "./fields/PlayerInfoFields";
import CavFields from "./fields/CavFields";
import { supabase } from "@/integrations/supabase/client";

const CadastroBankrollSection = () => {
  const [playerName, setPlayerName] = React.useState("");
  const [totalBankroll, setTotalBankroll] = React.useState<string>("");
  const [periodDescription, setPeriodDescription] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [maxPercent, setMaxPercent] = React.useState<string>("50");
  const [markup, setMarkup] = React.useState<string>("1.2");
  const [saving, setSaving] = React.useState(false);

  async function handleSalvarBankroll(e: React.FormEvent) {
    e.preventDefault();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      toast({ title: "Erro de autenticação", description: "Você precisa estar logado", variant: "destructive" });
      return;
    }
    
    if (!playerName.trim() || !totalBankroll || !periodDescription.trim()) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }
    
    if (Number(maxPercent) < 5 || Number(maxPercent) > 100) {
      toast({ title: "Percentual para venda deve ser entre 5% e 100%", variant: "destructive" });
      return;
    }
    
    if (Number(markup) < 1) {
      toast({ title: "O mark-up deve ser igual ou maior que 1", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("backing_offers").insert({
        offer_type: 'bankroll',
        player_name: playerName,
        total_bankroll: Number(totalBankroll),
        period_description: periodDescription,
        start_date: startDate || null,
        end_date: endDate || null,
        available_percentage: Number(maxPercent),
        markup_percentage: Number(markup),
        buy_in_amount: Number(totalBankroll), // For compatibility, use total as buy_in
        tournament_date: startDate || new Date().toISOString().split('T')[0],
        tournament_id: null as any, // Bankroll offers don't have tournament_id
        status: "open",
        user_id: user.id,
      });
      
      if (error) throw error;
      
      toast({ title: "Bankroll cadastrado com sucesso!" });
      setPlayerName("");
      setTotalBankroll("");
      setPeriodDescription("");
      setStartDate("");
      setEndDate("");
      setMaxPercent("50");
      setMarkup("1.2");
    } catch (err: any) {
      toast({ title: "Erro ao cadastrar bankroll", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-5 max-w-full w-full mx-auto px-0 sm:px-2 overflow-x-hidden">
      <h2 className="text-lg sm:text-xl font-semibold text-center sm:text-left">Cadastro de Bankroll</h2>
      <p className="text-sm text-muted-foreground">
        Ofereça um valor total para jogar em um período/evento. Os financiadores compram porcentagens desse valor.
      </p>
      
      <form className="space-y-3 sm:space-y-4" onSubmit={handleSalvarBankroll}>
        <PlayerInfoFields playerName={playerName} setPlayerName={setPlayerName} />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Valor Total do Bankroll (R$) *
          </label>
          <Input
            type="number"
            placeholder="Ex: 10000"
            value={totalBankroll}
            onChange={(e) => setTotalBankroll(e.target.value)}
            min={100}
            step={100}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Descrição do Período/Evento *
          </label>
          <Input
            type="text"
            placeholder="Ex: BSOP Millions - Janeiro 2025"
            value={periodDescription}
            onChange={(e) => setPeriodDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Data Início
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Data Fim
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <CavFields 
          maxPercent={maxPercent} 
          setMaxPercent={setMaxPercent} 
          markup={markup} 
          setMarkup={setMarkup} 
        />

        <div className="bg-muted rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-poker-gold">Resumo</h4>
          <p className="text-sm">
            Valor Total: <span className="font-bold">R$ {Number(totalBankroll || 0).toLocaleString()}</span>
          </p>
          <p className="text-sm">
            Disponível para venda: <span className="font-bold">{maxPercent}%</span> = 
            <span className="font-bold"> R$ {((Number(totalBankroll || 0) * Number(maxPercent)) / 100).toLocaleString()}</span>
          </p>
          <p className="text-sm">
            Com markup ({markup}x): <span className="font-bold">
              R$ {((Number(totalBankroll || 0) * Number(maxPercent) * Number(markup)) / 100).toLocaleString()}
            </span>
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-poker-gold hover:bg-poker-gold/90 text-white font-bold"
          disabled={saving}
        >
          {saving ? "Salvando..." : "Cadastrar Bankroll"}
        </Button>
      </form>
    </div>
  );
};

export default CadastroBankrollSection;
