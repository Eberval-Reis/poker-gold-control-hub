
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
import { Calendar } from "lucide-react";

interface QuickEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (novoEvento: { nome: string; data: string; cidade: string }) => void;
}

export const QuickEventModal: React.FC<QuickEventModalProps> = ({
  open,
  onOpenChange,
  onAddEvent,
}) => {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [cidade, setCidade] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !data.trim() || !cidade.trim()) return;
    onAddEvent({ nome, data, cidade });
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
            />
          </div>
          <div>
            <label className="block font-semibold text-poker-gold">Data</label>
            <Input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-poker-gold">Cidade</label>
            <Input
              value={cidade}
              onChange={e => setCidade(e.target.value)}
              placeholder="Digite a cidade"
              required
            />
          </div>
          <DialogFooter className="gap-2 mt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button className="bg-poker-gold hover:bg-poker-gold/90 text-white" type="submit">
              Salvar Evento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
