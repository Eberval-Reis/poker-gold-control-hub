
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

// Tipagem local para evitar erro do types gerado
type Backer = {
  id: string;
  name: string;
  whatsapp: string;
  cpf?: string | null;
  nickname?: string | null;
  email?: string | null;
  endereco?: string | null;
};

type FormValues = {
  name: string;
  whatsapp: string;
  cpf?: string;
  nickname?: string;
  email?: string;
  endereco?: string;
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
      .from("financiadores")
      .select("id, name, whatsapp, cpf, nickname, email, endereco")
      .order("name", { ascending: true });
    setIsLoading(false);

    // Defensive: Only set valid backers (avoid errors if data is not right)
    if (!error && Array.isArray(data)) {
      const validBackers = data.filter(isBacker);
      setBackers(validBackers);
    } else {
      setBackers([]);
      if (error) {
        // Optionally, you can log or toast the error here
        console.error("Erro ao buscar financiadores:", error);
      }
    }
  }

  // Modal form
  const { register, handleSubmit, reset, formState } = useForm<FormValues>();
  const [modalLoading, setModalLoading] = React.useState(false);

  async function onSubmit(form: FormValues) {
    setModalLoading(true);
    
    // Obter o usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      toast({ title: "Erro de autenticação", description: "Você precisa estar logado", variant: "destructive" });
      setModalLoading(false);
      return;
    }
    
    const { data, error } = await supabase
      .from("financiadores")
      .insert([{ ...form, user_id: user.id }])
      .select()
      .maybeSingle();
    setModalLoading(false);
    
    if (!error && data && data.id) {
      await fetchBackers();
      onChange(data.id);
      setOpen(false);
      reset();
      toast({ title: "Financiador cadastrado com sucesso!" });
    } else if (error) {
      console.error("Erro ao adicionar financiador:", error);
      toast({ title: "Erro ao cadastrar financiador", description: error.message, variant: "destructive" });
    }
  }

  const selected = backers.find((b) => b.id === value);

  return (
    <div className="flex flex-col gap-1">
      <label className="block text-poker-gold font-semibold mb-1 text-base">
        Nome do Financiador*
      </label>
      <div className="flex flex-row items-end gap-2">
        <div className="flex-1">
          <Select
            value={value ?? ""}
            onValueChange={(v) => onChange(v)}
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
              {selected.email && <div><b>Email:</b> {selected.email}</div>}
              {selected.endereco && <div><b>Endereço:</b> {selected.endereco}</div>}
            </div>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mb-[2px] border border-poker-gold/50 align-bottom"
              title="Adicionar Financiador"
              style={{ height: "40px", minHeight: "40px" }} // Garante que o botão tenha altura do select
            >
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
              <div>
                <label className="text-sm font-semibold block mb-1 text-poker-gold">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full p-2 rounded border border-input bg-background"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1 text-poker-gold">Endereço</label>
                <input
                  {...register("endereco")}
                  className="w-full p-2 rounded border border-input bg-background"
                  placeholder="Opcional"
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
    </div>
  );
}

