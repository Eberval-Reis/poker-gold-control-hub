
import React from "react";
import { useTheme } from "next-themes";

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
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = React.useState(
    () => typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  );
  React.useEffect(() => {
    if (resolvedTheme) setIsDark(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return (
    <div
      className="px-6 py-4 border-b border-border flex flex-col gap-0"
      style={{ background: isDark ? 'hsl(222, 47%, 12%)' : 'hsl(220, 15%, 96%)' }}
    >
      {eventName && (
        <span className="text-sm font-medium text-poker-gold tracking-wide">
          {eventName}
        </span>
      )}
      <span
        className="font-bold text-lg"
        style={{ color: isDark ? 'hsl(210, 40%, 98%)' : 'hsl(220, 20%, 10%)' }}
      >
        {tournamentName}
      </span>
      <span
        className="text-base"
        style={{ color: isDark ? 'hsl(215, 20.2%, 65.1%)' : 'hsl(220, 10%, 45%)' }}
      >
        Jogador: <span className="font-bold">{playerName}</span>
      </span>
    </div>
  )
};

export default BackersOfferHeader;
