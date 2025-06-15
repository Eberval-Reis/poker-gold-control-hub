
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

  const premLiq =
    typeof prize === "number" && !isNaN(prize)
      ? prize - (buyin * (vendidos / 100) * markup)
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
    <div className="w-full min-h-[80vh] flex justify-center items-center bg-gray-50 py-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-7 text-center">Registrar Resultado</h2>
        {loadingOffers ? (
          <div className="py-8 text-center">Carregando ofertas abertas...</div>
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
            <div className="flex flex-col gap-2">
              <label className="block text-poker-gold font-semibold mb-1">
                Selecione a oferta
              </label>
              <select
                value={selectedOfferId ?? ""}
                onChange={e => setSelectedOfferId(e.target.value)}
                className="w-full rounded border border-input p-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poker-gold focus-visible:ring-offset-2 bg-[#f7f8fa] text-black"
              >
                {offers.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.event_name ? `${o.event_name} · ` : ""}
                    {o.tournament_name} — {o.player_name} — {new Date(o.tournament_date).toLocaleDateString()} (R$ {Number(o.buy_in_amount).toLocaleString("pt-BR", {minimumFractionDigits:2})})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-poker-gold font-semibold mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full rounded border border-input p-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poker-gold focus-visible:ring-offset-2 bg-[#f7f8fa] text-black"
              >
                <option value="busto">Busto</option>
                <option value="itm">ITM</option>
                <option value="ft">Final Table</option>
                <option value="campeao">Campeão</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-poker-gold font-semibold mb-1">
                Prêmio ganho (R$)
              </label>
              <input
                type="number"
                value={prize}
                onChange={e => setPrize(Number(e.target.value))}
                className="w-full p-2 rounded border border-input bg-[#f7f8fa] text-base placeholder:text-gray-400"
                placeholder="Ex: 50000"
                min={0}
              />
            </div>
            <Button
              className="bg-poker-gold text-white px-6 py-2 rounded font-bold mt-2 hover:bg-poker-gold/90 transition-all"
              type="button"
              onClick={handleSave}
              disabled={loading || !offer}
            >
              {loading ? "Salvando..." : "Salvar Resultado"}
            </Button>
          </form>
        )}
        <div className="bg-[#f6f8fa] mt-7 p-4 rounded shadow-inner border border-gray-200">
          <div>
            <span className="font-bold">Prêmio líquido: </span>
            <span>R$ {premLiq.toLocaleString("pt-BR")}</span>
          </div>
          <div>
            <span className="font-bold">Backers recebem: </span>
            <span>R$ {backersValor.toLocaleString("pt-BR")}</span>
          </div>
          <div>
            <span className="font-bold">Cavaleiro recebe: </span>
            <span>R$ {jogadorValor.toLocaleString("pt-BR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarResultadoSection;

