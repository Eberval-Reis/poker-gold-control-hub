import React from "react";
import confetti from "canvas-confetti";
import { Button, type ButtonProps } from "@/components/ui/button";

export function confettiBurst() {
  if (typeof window === "undefined") return;

  // Quick celebratory burst
  const defaults = { zIndex: 9999, ticks: 120 } as const;

  confetti({
    ...defaults,
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    startVelocity: 45,
    scalar: 0.9,
  });

  // Secondary burst for richer effect
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 60,
      spread: 100,
      origin: { x: 0.2, y: 0.4 },
      startVelocity: 35,
      scalar: 0.8,
    });
    confetti({
      ...defaults,
      particleCount: 60,
      spread: 100,
      origin: { x: 0.8, y: 0.4 },
      startVelocity: 35,
      scalar: 0.8,
    });
  }, 150);
}

export function ConfettiButton({ onClick, children, ...props }: ButtonProps) {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick?.(e);
    confettiBurst();
  };

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
}
