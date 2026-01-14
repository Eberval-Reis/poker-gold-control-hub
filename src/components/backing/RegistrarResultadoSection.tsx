
import React from "react";
import { saveBackingResult } from "@/services/backing-result.service";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useBackingOfferList } from "@/hooks/useBackingOfferList";

const RegistrarResultadoSection = () => {
  const [prize, setPrize] = React.useState<number | string>("");
  const [status, setStatus] = React.useState("busto");
  const [loading, setLoading] = React.useState(false);

  // Busca backing_offers abertos pelo hook
  const { data: offers = [], isLoading: loadingOffers } = useBackingOfferList();
  const [selectedOfferId, setSelectedOfferId] = React.useState<string | null>(null);

  // Seleciona automaticamente o primeiro, se houver e não houver seleção
  React.useEffect(() => {
    if (offers.length > 0 && !selectedOfferId) {
      setSelectedOfferId(offers[0].id);
    }
  }, [offers, selectedOfferId]);

  // Seleciona o offer atual
  const offer = offers.find(o => o.id === selectedOfferId) || null;

  // Para preview, usa os dados do offer selecionado, senão defaults
  const buyin = offer?.buy_in_amount ?? 10000;
  const markup = offer?.markup_percentage ?? 1.5;
  const vendidos = offer?.available_percentage
    ? 100 - offer.available_percentage
    : 70;

  // Prêmio líquido = Prêmio bruto - Buy-in total
  const premLiq =
    typeof prize === "number" && !isNaN(prize)
      ? prize - buyin
      : 0;

  const backersValor =
    typeof prize === "number" && !isNaN(prize)
      ? (premLiq > 0 ? premLiq * (vendidos / 100) : 0)
      : 0;

  const jogadorValor =
    typeof prize === "number" && !isNaN(prize)
      ? (premLiq > 0 ? premLiq * ((100 - vendidos) / 100) : 0)
      : 0;

  async function handleSave() {
    if (!offer) {
      toast({ title: "Erro", description: "Nenhuma oferta de backing selecionada.", variant: "destructive" });
      return;
    }
    if (!prize || isNaN(Number(prize)) || Number(prize) < 0) {
      toast({ title: "Erro", description: "Informe um valor de prêmio válido.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await saveBackingResult({
        backingOfferId: offer.id,
        prizeAmount: Number(prize),
        netPrize: premLiq,
        playerProfit: jogadorValor,
        resultType: status,
      });
      toast({ title: "Resultado salvo com sucesso!" });
      setPrize("");
      setStatus("busto");
    } catch (err: any) {
      // Busca erro de constraint referente ao result_type
      const dbConstraintMsg = typeof err.message === "string" && err.message.includes("backing_results_result_type_check");
      if (dbConstraintMsg) {
        toast({
          title: "Erro ao salvar",
          description: "O status informado não é permitido. Só é possível: busto, itm, ft ou campeão.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao salvar resultado",
          description: err?.message || "Ocorreu um erro inesperado ao salvar.",
          variant: "destructive",
        });
      }
    }
    setLoading(false);
  }

  return (
    <div className="w-full min-h-[80vh] flex justify-center items-center bg-muted/30 py-10 px-4">
      <div className="w-full max-w-lg bg-card rounded-lg shadow-sm p-6 sm:p-8 border">
        <h2 className="text-xl font-semibold mb-6 text-center text-foreground">Registrar Resultado</h2>
        {loadingOffers ? (
          <div className="py-8 text-center text-muted-foreground">Carregando ofertas abertas...</div>
        ) : offers.length === 0 ? (
          <div className="bg-muted border border-dashed rounded p-6 text-center space-y-2">
            <div className="font-bold text-muted-foreground">Nenhuma oferta de backing aberta.</div>
            <div className="text-muted-foreground text-sm">
              Cadastre uma oferta de backing antes de registrar um resultado.
            </div>
            <a href="#tab-cadastro" className="inline-block mt-3">
              <Button variant="outline">Cadastrar Torneio/Oferta</Button>
            </a>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={e => e.preventDefault()}>
            {/* Seleção da Oferta */}
            <div className="flex flex-col gap-2">
              <label className="block text-poker-gold font-semibold text-sm">
                Selecione a oferta
              </label>
              <select
                value={selectedOfferId ?? ""}
                onChange={e => setSelectedOfferId(e.target.value)}
                className="w-full rounded border border-input p-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poker-gold focus-visible:ring-offset-2 bg-background text-foreground"
              >
                {offers.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.tournament_name} — {o.player_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Painel de Dados da Oferta Selecionada */}
            {offer && (
              <div className="bg-muted/50 border rounded-lg p-4 space-y-1">
                <h3 className="font-semibold text-xs text-muted-foreground mb-3 uppercase tracking-wide">
                  📋 Dados da Oferta
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {offer.event_name && (
                    <>
                      <span className="text-muted-foreground">Evento:</span>
                      <span className="font-medium text-foreground">{offer.event_name}</span>
                    </>
                  )}
                  <span className="text-muted-foreground">Torneio:</span>
                  <span className="font-medium text-foreground">{offer.tournament_name}</span>
                  
                  <span className="text-muted-foreground">Data:</span>
                  <span className="font-medium text-foreground">
                    {new Date(offer.tournament_date).toLocaleDateString('pt-BR')}
                  </span>
                  
                  <span className="text-muted-foreground">Buy-in:</span>
                  <span className="font-medium text-foreground">
                    R$ {Number(offer.buy_in_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  
                  <span className="text-muted-foreground">% Vendido:</span>
                  <span className="font-medium text-foreground">
                    {(100 - offer.available_percentage).toFixed(1)}%
                  </span>
                  
                  <span className="text-muted-foreground">Markup:</span>
                  <span className="font-medium text-foreground">{offer.markup_percentage}x</span>
                  
                  <span className="text-muted-foreground">Jogador:</span>
                  <span className="font-medium text-foreground">{offer.player_name}</span>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="block text-poker-gold font-semibold text-sm">
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full rounded border border-input p-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poker-gold focus-visible:ring-offset-2 bg-background text-foreground"
              >
                <option value="busto">Busto</option>
                <option value="itm">ITM</option>
                <option value="ft">Final Table</option>
                <option value="campeao">Campeão</option>
              </select>
            </div>

            {/* Prêmio */}
            <div className="flex flex-col gap-2">
              <label className="block text-poker-gold font-semibold text-sm">
                Prêmio ganho (R$)
              </label>
              <input
                type="number"
                value={prize}
                onChange={e => setPrize(Number(e.target.value))}
                className="w-full p-2 rounded border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground"
                placeholder="Ex: 50000"
                min={0}
              />
            </div>

            <Button
              className="w-full bg-poker-gold text-white py-2 rounded font-bold mt-2 hover:bg-poker-gold/90 transition-all"
              type="button"
              onClick={handleSave}
              disabled={loading || !offer}
            >
              {loading ? "Salvando..." : "Salvar Resultado"}
            </Button>
          </form>
        )}

        {/* Preview de Cálculo */}
        <div className="bg-muted/50 mt-6 p-4 rounded-lg border space-y-2">
          <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-2">
            💰 Preview do Resultado
          </h4>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Prêmio líquido:</span>
            <span className="font-semibold text-foreground">R$ {premLiq.toLocaleString("pt-BR")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Backers recebem:</span>
            <span className="font-semibold text-foreground">R$ {backersValor.toLocaleString("pt-BR")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cavaleiro recebe:</span>
            <span className="font-semibold text-foreground">R$ {jogadorValor.toLocaleString("pt-BR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarResultadoSection;

