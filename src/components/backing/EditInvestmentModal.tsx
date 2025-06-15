
import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

type Investment = {
  id: string;
  percentage_bought: number;
  amount_paid: number;
  payment_status: string | null;
};

interface EditInvestmentModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  investment: Investment | null;
  onSubmit: (values: { percentage_bought: number; amount_paid: number; payment_status: string }) => Promise<void>;
  isUpdating: boolean;
}

export default function EditInvestmentModal({
  open,
  onOpenChange,
  investment,
  onSubmit,
  isUpdating,
}: EditInvestmentModalProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      percentage_bought: investment?.percentage_bought ?? 0,
      amount_paid: investment?.amount_paid ?? 0,
      payment_status: investment?.payment_status === "paid"
    }
  });

  React.useEffect(() => {
    // Atualizar valores ao abrir o modal ou investimento mudar
    if (investment) {
      reset({
        percentage_bought: investment.percentage_bought,
        amount_paid: investment.amount_paid,
        payment_status: investment.payment_status === "paid"
      });
    }
  }, [investment, reset]);

  if (!investment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          onSubmit={handleSubmit((val) =>
            onSubmit({
              percentage_bought: Number(val.percentage_bought),
              amount_paid: Number(val.amount_paid),
              payment_status: val.payment_status ? "paid" : "pending"
            })
          )}
          className="flex flex-col gap-5"
        >
          <DialogHeader>
            <DialogTitle>Editar Investimento</DialogTitle>
            <DialogDescription>
              Altere os campos desejados e clique em Salvar.
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="font-semibold text-poker-gold block mb-1">% Ação</label>
            <Input
              type="number"
              min={0}
              max={100}
              step={1}
              {...register("percentage_bought", { required: true, min: 0, max: 100 })}
              disabled={isUpdating}
            />
          </div>
          <div>
            <label className="font-semibold text-poker-gold block mb-1">Valor Pago</label>
            <Input
              type="number"
              min={0}
              step={0.01}
              {...register("amount_paid", { required: true, min: 0 })}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center gap-3 mt-1">
            <Switch
              id="edit-payment-status"
              {...register("payment_status")}
              checked={watch("payment_status")}
              onCheckedChange={value => setValue("payment_status", value)}
              disabled={isUpdating}
            />
            <label htmlFor="edit-payment-status" className="text-base font-medium text-poker-gold cursor-pointer">
              Marcar como Pago
            </label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isUpdating}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" className="bg-poker-gold text-white" disabled={isUpdating}>
              {isUpdating && <Loader2 className="animate-spin mr-2" size={16} />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
