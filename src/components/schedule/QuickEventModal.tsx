
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface QuickEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (eventoSalvo: { id: string; name: string; date?: string | null }) => void;
}

export const QuickEventModal: React.FC<QuickEventModalProps> = ({
  open,
  onOpenChange,
  onAddEvent,
}) => {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [cidade, setCidade] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nome.trim() || !data.trim() || !cidade.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setLoading(true);
    // Como ainda não existe campo 'cidade', concatenamos no nome:
    const fullName = `${nome} - ${cidade}`;
    const { data: inserted, error } = await supabase
      .from("schedule_events")
      .insert([{ name: fullName, date: data }])
      .select()
      .maybeSingle();
    setLoading(false);

    if (error || !inserted) {
      setError("Erro ao salvar evento. Tente novamente.");
      return;
    }
    // Informa componente pai e reseta o modal
    onAddEvent({ id: inserted.id, name: inserted.name, date: inserted.date });
    setNome("");
    setData("");
    setCidade("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar novo Evento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="block font-semibold text-poker-gold">Nome do Evento</label>
            <Input
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite o nome"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-semibold text-poker-gold">Data</label>
            <Input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-semibold text-poker-gold">Cidade</label>
            <Input
              value={cidade}
              onChange={e => setCidade(e.target.value)}
              placeholder="Digite a cidade"
              required
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm py-1">{error}</div>
          )}
          <DialogFooter className="gap-2 mt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={loading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="bg-poker-gold hover:bg-poker-gold/90 text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
