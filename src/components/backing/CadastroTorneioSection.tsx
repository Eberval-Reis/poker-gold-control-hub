
import React from "react";
import { Switch } from "@/components/ui/switch";

const CadastroTorneioSection = () => {
  const [cavEnable, setCavEnable] = React.useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-semibold">Cadastro do Torneio</h2>
      <form className="space-y-4">
        {/* Linha dos campos principais */}
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-poker-gold font-semibold mb-1">Nome do Torneio *</label>
            <input
              required
              className="w-full p-2 rounded border border-input bg-background text-base"
              placeholder="Digite o nome do torneio"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-poker-gold font-semibold mb-1">Buy-in (R$) *</label>
            <input
              required
              type="number"
              step="0.01"
              className="w-full p-2 rounded border border-input bg-background text-base"
              placeholder="Valor do buy-in"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-poker-gold font-semibold mb-1">Data *</label>
            <input
              type="date"
              required
              className="w-full p-2 rounded border border-input bg-background text-base"
            />
          </div>
        </div>
        {/* Switch e grupo de cavalagem */}
        <div className="flex items-center gap-3 mt-3">
          <Switch checked={cavEnable} onCheckedChange={setCavEnable} />
          <span className="font-medium text-gray-800">Habilitar Cavalagem?</span>
        </div>
        {cavEnable && (
          <div className="mt-4 p-4 bg-muted rounded-lg flex gap-4 flex-col md:flex-row">
            <div className="flex-1">
              <label className="block text-poker-gold font-semibold mb-1">% Máxima para Venda</label>
              <input
                type="number"
                required
                min={5}
                max={80}
                className="w-full p-2 rounded border border-input bg-background text-base"
                placeholder="Ex: 80"
              />
            </div>
            <div className="flex-1">
              <label className="block text-poker-gold font-semibold mb-1">Mark-up Padrão</label>
              <input
                type="number"
                required
                min={1}
                step="0.01"
                className="w-full p-2 rounded border border-input bg-background text-base"
                placeholder="Ex: 1.5"
              />
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <button className="bg-poker-gold text-white px-6 py-2 rounded hover:bg-poker-gold/90 font-bold" type="submit">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroTorneioSection;
