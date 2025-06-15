
import React from "react";

interface PlayerInfoFieldsProps {
  playerName: string;
  setPlayerName: (v: string) => void;
}

export default function PlayerInfoFields({ playerName, setPlayerName }: PlayerInfoFieldsProps) {
  return (
    <div>
      <label className="block text-poker-gold font-semibold mb-1">
        Nome do Jogador *
      </label>
      <input
        type="text"
        required
        className="w-full p-2 rounded border border-input bg-background text-base"
        placeholder="Quem será financiado"
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
      />
    </div>
  );
}
