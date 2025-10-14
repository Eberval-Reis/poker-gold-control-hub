
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface TournamentDropdownProps {
  tournaments: { id: string; name: string }[];
  value: string;
  onChange: (id: string, name: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export const TournamentDropdown: React.FC<TournamentDropdownProps> = ({
  tournaments,
  value,
  onChange,
  error,
  disabled
}) => {
  const formatTournamentDisplay = (tournament: { id: string; name: string; date?: string }) => {
    if (tournament.date) {
      return `${tournament.name} (${tournament.date})`;
    }
    return tournament.name;
  };

  return (
    <Select
      value={value}
      onValueChange={id => {
        const tournament = tournaments.find(t => t.id === id);
        onChange(id, tournament?.name ?? "");
      }}
      disabled={disabled || tournaments.length === 0}
    >
      <SelectTrigger className={error ? "w-full border-red-500" : "w-full"}>
        <SelectValue placeholder="Selecione..." />
      </SelectTrigger>
      <SelectContent>
        {tournaments.map((t) => (
          <SelectItem value={t.id} key={t.id}>
            {formatTournamentDisplay(t)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

