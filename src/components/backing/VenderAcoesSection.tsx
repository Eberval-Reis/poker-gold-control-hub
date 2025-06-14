
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import BackerSelectWithModal from "./BackerSelectWithModal"; // NOVO COMPONENTE

const VenderAcoesSection = () => {
  const [percent, setPercent] = React.useState(5);
  const [backerId, setBackerId] = React.useState<string | null>(null);

  // Placeholder values
  const buyin = 10000;
  const markup = 1.5;
  const disponivel = 70;

  return (
    <div className="space-y-7 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-poker-gold mb-1">Vender Ações</h2>
      <div className="bg-muted rounded-xl p-5 flex flex-col gap-1 border border-poker-gold/10 shadow-sm">
        <span className="font-medium text-gray-900 text-base">
          Torneio: <span className="font-bold">WSOP Main Event</span>
        </span>
        <span className="text-gray-700">
          Buy-in: <span className="font-bold">R$ {buyin.toLocaleString()}</span>
        </span>
        <span className="text-gray-700">
          Ações Disponíveis: <span className="font-bold">{disponivel}%</span>
        </span>
      </div>
      <form className="flex flex-col gap-5 bg-white/90 rounded-xl px-5 py-6 shadow border border-gray-100">
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
          />
          <span className="text-base">{percent}%</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="block text-poker-gold font-semibold mb-1">
            Valor com mark-up
          </label>
          <input
            readOnly
            value={`R$ ${(buyin * (percent / 100) * markup).toLocaleString()}`}
            className="w-full p-2 rounded border border-input bg-background text-base"
            style={{ minHeight: 42 }}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-poker-gold hover:bg-poker-gold/90 text-white py-3 text-base font-bold rounded mt-2 shadow transition"
        >
          Adicionar Backer
        </Button>
      </form>
    </div>
  );
};

export default VenderAcoesSection;
