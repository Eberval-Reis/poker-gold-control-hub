import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Tipagem local para evitar erro do types gerado
type Backer = {
  id: string;
  name: string;
  whatsapp: string;
  cpf?: string | null;
  nickname?: string | null;
};

type FormValues = {
  name: string;
  whatsapp: string;
  cpf?: string;
  nickname?: string;
};

// Helper runtime type guard
function isBacker(obj: any): obj is Backer {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.whatsapp === "string"
  );
}

export default function BackerSelectWithModal({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [backers, setBackers] = React.useState<Backer[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    fetchBackers();
  }, []);

  async function fetchBackers() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("financiadores" as any)
      .select("id, name, whatsapp, cpf, nickname")
      .order("name", { ascending: true });
    setIsLoading(false);

    // Only store valid Backer objects
    if (!error && Array.isArray(data)) {
      setBackers(
        data.filter(isBacker)
      );
    } else {
      setBackers([]);
    }
  }

  // Modal form
  const { register, handleSubmit, reset, formState } = useForm<FormValues>();
  const [modalLoading, setModalLoading] = React.useState(false);

  async function onSubmit(form: FormValues) {
    setModalLoading(true);
    const { data, error } = await supabase
      .from("financiadores" as any)
      .insert([form])
      .select()
      .single();
    setModalLoading(false);
    if (!error && data && data.id) {
      await fetchBackers();
      onChange(data.id);
      setOpen(false);
      reset();
    }
  }

  // Defensive: only try to find by id if all backers have id 
  const selected = backers.find((b) => b.id === value);

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <label className="block text-poker-gold font-semibold mb-1 text-base">
          Nome do Financiador*
        </label>
        <Select
          value={value ?? ""}
          onValueChange={v => onChange(v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione ou busque um financiador"} />
          </SelectTrigger>
          <SelectContent className="z-50 bg-background">
            {backers.length === 0 && !isLoading && (
              <div className="px-4 py-2 text-muted-foreground text-sm">Nenhum financiador encontrado</div>
            )}
            {backers.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
                {b.nickname ? ` (${b.nickname})` : ""}
                {b.whatsapp ? ` - ${b.whatsapp}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected && (
          <div className="text-xs mt-1 text-muted-foreground">
            <div><b>WhatsApp:</b> {selected.whatsapp}</div>
            {selected.cpf && <div><b>CPF:</b> {selected.cpf}</div>}
            {selected.nickname && <div><b>Apelido:</b> {selected.nickname}</div>}
          </div>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="mb-1 border border-poker-gold/50" title="Adicionar Financiador">
            <Plus className="w-5 h-5 text-poker-gold" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Cadastrar novo Financiador</DialogTitle>
          <form
            className="flex flex-col gap-3 pt-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label className="text-sm font-semibold block mb-1 text-poker-gold">Nome*</label>
              <input
                {...register("name", { required: true })}
                className="w-full p-2 rounded border border-input bg-background"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1 text-poker-gold">WhatsApp*</label>
              <input
                {...register("whatsapp", { required: true })}
                className="w-full p-2 rounded border border-input bg-background"
                placeholder="(99) 99999-9999"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1 text-poker-gold">CPF</label>
              <input
                {...register("cpf")}
                className="w-full p-2 rounded border border-input bg-background"
                placeholder="Opicional"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1 text-poker-gold">Apelido</label>
              <input
                {...register("nickname")}
                className="w-full p-2 rounded border border-input bg-background"
                placeholder="Opicional"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-poker-gold hover:bg-poker-gold/90 text-white mt-2"
              disabled={modalLoading}
            >
              Cadastrar Financiador
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
