
import React from "react";

interface CavFieldsProps {
  maxPercent: string;
  setMaxPercent: (v: string) => void;
  markup: string;
  setMarkup: (v: string) => void;
}

export default function CavFields({
  maxPercent,
  setMaxPercent,
  markup,
  setMarkup,
}: CavFieldsProps) {
  return (
    <div className="mt-4 p-4 bg-muted rounded-lg flex gap-4 flex-col md:flex-row">
      <div className="flex-1">
        <label className="block text-poker-gold font-semibold mb-1">
          % Máxima para Venda
        </label>
        <input
          type="number"
          required
          min={5}
          max={80}
          className="w-full p-2 rounded border border-input bg-background text-base"
          placeholder="Ex: 80"
          value={maxPercent}
          onChange={e => setMaxPercent(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <label className="block text-poker-gold font-semibold mb-1">
          Mark-up Padrão <span className="text-muted-foreground font-normal text-sm">(opcional)</span>
        </label>
        <input
          type="number"
          min={1}
          step="0.01"
          className="w-full p-2 rounded border border-input bg-background text-base"
          placeholder="1.0 (sem markup)"
          value={markup}
          onChange={e => setMarkup(e.target.value)}
        />
      </div>
    </div>
  );
}
