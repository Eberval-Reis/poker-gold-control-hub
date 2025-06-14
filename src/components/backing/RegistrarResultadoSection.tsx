
import React from "react";

const RegistrarResultadoSection = () => {
  const [prize, setPrize] = React.useState<number | string>("");
  const [status, setStatus] = React.useState("busto");
  const buyin = 10000;
  const markup = 1.5;
  const vendidos = 70;

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

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-xl font-semibold">Registrar Resultado</h2>
      <form className="space-y-4">
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
      <button className="mt-4 bg-poker-gold text-white px-6 py-2 rounded hover:bg-poker-gold/90 font-bold" type="button">
        Salvar Resultado
      </button>
    </div>
  );
};

export default RegistrarResultadoSection;
