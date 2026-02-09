import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { BeforeInstallPromptEvent } from "@/types";

// A2HS install prompt component
const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e as unknown as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible) return null;

  const onInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[10000] animate-fade-in">
      <Button onClick={onInstallClick} className="shadow-lg">
        <Plus className="h-4 w-4" />
        <span>Adicionar à Tela Inicial</span>
      </Button>
    </div>
  );
};

export default PWAInstallPrompt;
