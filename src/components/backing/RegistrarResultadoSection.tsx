
import React from "react";
import { saveBackingResult } from "@/services/backing-result.service";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const RegistrarResultadoSection = () => {
  const [prize, setPrize] = React.useState<number | string>("");
  const [status, setStatus] = React.useState("busto");
  const [loading, setLoading] = React.useState(false);

  // Busca backing_offer para teste (pega o primeiro do banco)
  const [offer, setOffer] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.from("backing_offers").select("*").limit(1).then(({ data }) => {
      if (data && data.length > 0) setOffer(data[0]);
    });
  }, []);

  // Para preview, usa os dados do offer buscado, senão defaults
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
      toast({ title: "Erro", description: "Nenhum backing offer encontrado.", variant: "destructive" });
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
      toast({ title: "Erro ao salvar resultado", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-xl font-semibold">Registrar Resultado</h2>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); }}>
        <div>
          <label className="block text-poker-gold font-semibold mb-1">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full rounded p-2 text-black bg-background border border-input outline-none"
          >
            <option value="busto">Busto</option>
            <option value="itm">ITM</option>
            <option value="ft">Final Table</option>
            <option value="campeao">Campeão</option>
          </select>
        </div>
        <div>
          <label className="block text-poker-gold font-semibold mb-1">
            Prêmio ganho (R$)
          </label>
          <input
            type="number"
            value={prize}
            onChange={e => setPrize(Number(e.target.value))}
            className="w-full p-2 rounded border border-input bg-background text-base"
            placeholder="Ex: 50000"
          />
        </div>
        <button
          className="mt-4 bg-poker-gold text-white px-6 py-2 rounded hover:bg-poker-gold/90 font-bold"
          type="button"
          onClick={handleSave}
          disabled={loading || !offer}
        >
          {loading ? "Salvando..." : "Salvar Resultado"}
        </button>
      </form>
      <div className="bg-muted p-4 rounded space-y-2">
        <div>
          <span className="font-bold">Prêmio líquido: </span>
          <span>R$ {premLiq.toLocaleString()}</span>
        </div>
        <div>
          <span className="font-bold">Backers recebem: </span>
          <span>R$ {backersValor.toLocaleString()}</span>
        </div>
        <div>
          <span className="font-bold">Cavaleiro recebe: </span>
          <span>R$ {jogadorValor.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default RegistrarResultadoSection;
