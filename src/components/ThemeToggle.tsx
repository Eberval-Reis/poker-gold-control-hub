
import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  function handleToggle() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Alternar entre tema claro e escuro"
      onClick={handleToggle}
      className="rounded-full"
    >
      <span className="sr-only">{isDark ? "Habilitar tema claro" : "Habilitar tema escuro"}</span>
      {isDark ? (
        <Sun className="transition-all duration-200 text-poker-gold" size={22} />
      ) : (
        <Moon className="transition-all duration-200 text-poker-gold" size={22} />
      )}
    </Button>
  );
}
