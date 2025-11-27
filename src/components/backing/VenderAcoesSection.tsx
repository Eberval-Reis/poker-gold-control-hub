
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import BackerSelectWithModal from "./BackerSelectWithModal";
import { useBackingOfferList, BackingOffer } from "@/hooks/useBackingOfferList";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const VenderAcoesSection = () => {
  const [percent, setPercent] = React.useState(5);
  const [backerId, setBackerId] = React.useState<string | null>(null);
  const [selectedOfferId, setSelectedOfferId] = React.useState<string | null>(null);
  const [isPaid, setIsPaid] = React.useState(false);

  const { data: offers, isLoading, error } = useBackingOfferList();
  const selectedOffer: BackingOffer | undefined = offers?.find(o => o.id === selectedOfferId);

  // Quando houver nova lista, definir a oferta inicial
  React.useEffect(() => {
    if (offers && offers.length > 0 && !selectedOfferId) {
      setSelectedOfferId(offers[0].id);
    }
  }, [offers, selectedOfferId]);

  // Atualiza o percentual sempre que mudar a oferta
  React.useEffect(() => {
    if (selectedOffer) {
      setPercent(Math.min(5, selectedOffer.available_percentage));
    }
  }, [selectedOfferId]);

  // Resetar toggle ao selecionar nova oferta ou adicionar backer
  React.useEffect(() => {
    setIsPaid(false);
  }, [selectedOfferId]);

  if (isLoading) {
    return <div className="text-center my-10 text-poker-gold">Carregando torneios cadastrados...</div>;
  }
  if (error) {
    return <div className="text-center my-10 text-red-500">Erro ao carregar ofertas</div>;
  }
  if (!offers || offers.length === 0) {
    return <div className="text-center my-10 text-poker-gold">Nenhum torneio cadastrado para vender ações.</div>;
  }

  const buyin = selectedOffer?.buy_in_amount ?? 0;
  const markup = selectedOffer?.markup_percentage ?? 1;
  const disponivel = selectedOffer?.available_percentage ?? 0;

  // Lidar com envio do form para salvar investimento
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { supabase } = await import("@/lib/supabase");

    // Validação simples
    if (!selectedOffer) {
      toast({ variant: "destructive", title: "Torneio não selecionado" });
      return;
    }
    if (!backerId) {
      toast({ variant: "destructive", title: "Financiador não selecionado" });
      return;
    }
    if (!percent || percent < 5 || percent > selectedOffer.available_percentage) {
      toast({
        variant: "destructive",
        title: "Percentual inválido",
        description: `O percentual deve ser entre 5% e o disponível (${selectedOffer.available_percentage}%)`
      });
      return;
    }

    // Buscar nome do backer por id (opcional, para salvar no registro)
    let backerName = "";
    try {
      const { data: backerData, error: backerError } = await supabase
        .from("financiadores")
        .select("name")
        .eq("id", backerId)
        .maybeSingle();
      if (backerError || !backerData) {
        throw new Error("Erro ao buscar nome do financiador");
      }
      backerName = backerData.name;
    } catch (err) {
      toast({ variant: "destructive", title: "Erro ao buscar financiador" });
      return;
    }

    // Obter usuário autenticado para passar user_id na RLS
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      toast({ variant: "destructive", title: "Erro de autenticação", description: "Você precisa estar logado." });
      return;
    }

    // Salvar na backing_investments
    toast({ title: "Salvando investimento..." });
    const { data, error } = await supabase
      .from("backing_investments")
      .insert([
        {
          backing_offer_id: selectedOffer.id,
          percentage_bought: percent,
          amount_paid: Number((selectedOffer.buy_in_amount * (percent / 100) * selectedOffer.markup_percentage).toFixed(2)),
          backer_name: backerName,
          payment_status: isPaid ? "paid" : "pending",
          user_id: user.id,
        },
      ]);

    if (error) {
      toast({ variant: "destructive", title: "Erro ao salvar", description: error.message });
      return;
    }

    toast({ variant: "default", title: "Sucesso!", description: "Investimento adicionado!" });

    // Resetar campos e atualizar disponibilidade
    setBackerId(null);
    setSelectedOfferId(null);
    setPercent(5);
    setIsPaid(false);
  }

  return (
    // Ajuste: overflow-x-hidden + larguras responsivas no mobile
    <div className="space-y-7 max-w-lg mx-auto px-2 overflow-x-hidden">
      <h2 className="text-2xl font-bold text-poker-gold mb-1">Vender Ações</h2>
      {/* Seleção da oferta */}
      <div>
        <label className="block text-poker-gold font-semibold mb-1" htmlFor="offerselect">
          Torneio para venda de ação
        </label>
        <select
          id="offerselect"
          className="w-full p-2 rounded border border-input bg-background text-base mb-2"
          value={selectedOfferId || ""}
          onChange={e => setSelectedOfferId(e.target.value)}
        >
          {offers?.map(offer =>
            <option key={offer.id} value={offer.id}>
              {offer.tournament_name || "—"}
            </option>
          )}
        </select>
      </div>
      {/* Card de informações do torneio */}
      <div className="bg-muted rounded-xl p-5 flex flex-col gap-1 border border-poker-gold/10 shadow-sm min-w-0">
        {selectedOffer?.event_name && (
          <span className="font-bold text-lg text-poker-gold mb-0" style={{ lineHeight: 1.1 }}>
            {selectedOffer.event_name}
          </span>
        )}
        <span className="font-medium text-poker-gold text-lg" style={{ marginTop: selectedOffer?.event_name ? '2px' : 0 }}>
          {selectedOffer?.tournament_name || "-"}
        </span>
        <span className="text-gray-900 font-medium text-base">
          Jogador: <span className="font-bold">{selectedOffer?.player_name ?? "-"}</span>
        </span>
        <span className="font-medium text-gray-900 text-base">
          Buy-in: <span className="font-bold">R$ {buyin.toLocaleString()}</span>
        </span>
        <span className="text-gray-700">
          Ações Disponíveis: <span className="font-bold">{disponivel}%</span>
        </span>
        <span className="text-gray-700">
          Mark-up: <span className="font-bold">{markup}</span>
        </span>
      </div>
      <form 
        className="flex flex-col gap-5 bg-white/90 rounded-xl px-2 py-6 shadow border border-gray-100 min-w-0"
        onSubmit={handleSubmit}
      >
        <BackerSelectWithModal value={backerId} onChange={setBackerId} />
        <div className="flex flex-col gap-0">
          <label className="block text-poker-gold font-semibold mb-1">
            % da ação *
          </label>
          <Slider
            min={5}
            max={disponivel}
            value={[percent]}
            onValueChange={(vals) => setPercent(vals[0])}
            step={5}
            className="mb-2 mt-2"
            disabled={!selectedOffer}
          />
          <span className="text-base">{percent}%</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="block text-poker-gold font-semibold mb-1">
            Valor com mark-up
          </label>
          <input
            readOnly
            value={
              selectedOffer
                ? `R$ ${(buyin * (percent / 100) * markup).toLocaleString(undefined, {maximumFractionDigits:2})}`
                : ""
            }
            className="w-full p-2 rounded border border-input bg-background text-base"
            style={{ minHeight: 42 }}
          />
        </div>
        <div className="flex items-center gap-3 mt-2 mb-1">
          <Switch id="toggle-payment" checked={isPaid} onCheckedChange={setIsPaid} />
          <label htmlFor="toggle-payment" className="text-base font-medium text-poker-gold cursor-pointer">
            Marcar como Pago
          </label>
        </div>
        <Button
          type="submit"
          className="w-full bg-poker-gold hover:bg-poker-gold/90 text-white py-3 text-base font-bold rounded mt-2 shadow transition"
          disabled={!selectedOffer}
        >
          Adicionar Backer
        </Button>
      </form>
    </div>
  );
};

export default VenderAcoesSection;

