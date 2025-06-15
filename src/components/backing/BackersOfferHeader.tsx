
import React from "react";

interface BackersOfferHeaderProps {
  eventName?: string | null;
  tournamentName?: string;
  playerName?: string;
}

const BackersOfferHeader: React.FC<BackersOfferHeaderProps> = ({
  eventName,
  tournamentName,
  playerName
}) => {
  return (
    <div className="bg-gray-100 px-6 py-4 rounded-t-md border border-b-0 border-gray-200 flex flex-col gap-0">
      {eventName && (
        <span className="text-sm font-medium text-poker-gold tracking-wide">
          {eventName}
        </span>
      )}
      <span className="font-bold text-lg text-gray-900">{tournamentName}</span>
      <span className="text-base text-gray-700">
        Jogador: <span className="font-bold">{playerName}</span>
      </span>
    </div>
  )
};

export default BackersOfferHeader;
