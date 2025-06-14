
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const VenderAcoesSection = () => {
  const [percent, setPercent] = React.useState(5);

  // Placeholder values
  const buyin = 10000;
  const markup = 1.5;
  const disponivel = 70;

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-xl font-semibold">Vender Ações</h2>
      <div className="bg-muted p-3 rounded flex flex-col gap-2">
        <span className="font-medium">
          Torneio: <b>WSOP Main Event</b>
        </span>
        <span>Buy-in: <b>R$ {buyin.toLocaleString()}</b></span>
        <span>Ações Disponíveis: <b>{disponivel}%</b></span>
      </div>
      <form className="space-y-4">
        <div>
          <label className="block text-poker-gold font-semibold mb-1">Nome do Backer*</label>
          <input
            required
            className="w-full p-2 rounded border border-input bg-background text-base"
            placeholder="Nome ou selecione cadastrado"
          />
        </div>
        <div>
          <label className="block text-poker-gold font-semibold mb-1">% da ação *</label>
          <Slider
            min={5}
            max={disponivel}
            value={[percent]}
            onValueChange={(vals) => setPercent(vals[0])}
            step={5}
            className="mb-2"
          />
          <span>{percent}%</span>
        </div>
        <div>
          <label className="block text-poker-gold font-semibold mb-1">Valor com mark-up</label>
          <input
            readOnly
            value={`R$ ${(buyin * (percent / 100) * markup).toLocaleString()}`}
            className="w-full p-2 rounded border border-input bg-background text-base"
          />
        </div>
        <Button type="submit" className="bg-poker-gold hover:bg-poker-gold/90 w-full">
          Adicionar Backer
        </Button>
      </form>
    </div>
  );
};

export default VenderAcoesSection;
