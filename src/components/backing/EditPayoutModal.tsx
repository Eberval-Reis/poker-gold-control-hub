
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

interface EditPayoutModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    payout: {
        id: string;
        payout_amount: number;
        investment_id: string;
    } | null;
    onSubmit: (values: { payout_amount: number }) => Promise<void>;
    isUpdating: boolean;
}

export default function EditPayoutModal({
    open,
    onOpenChange,
    payout,
    onSubmit,
    isUpdating,
}: EditPayoutModalProps) {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            payout_amount: payout?.payout_amount ?? 0,
        },
    });

    React.useEffect(() => {
        if (payout) {
            reset({
                payout_amount: payout.payout_amount,
            });
        }
    }, [payout, reset]);

    if (!payout) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form
                    onSubmit={handleSubmit((val) =>
                        onSubmit({
                            payout_amount: Number(val.payout_amount),
                        })
                    )}
                    className="flex flex-col gap-5"
                >
                    <DialogHeader>
                        <DialogTitle>Editar Retorno</DialogTitle>
                        <DialogDescription>
                            Altere o valor do retorno para este backer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label className="font-semibold text-poker-gold block mb-1">
                                Valor do Retorno (R$)
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min={0}
                                {...register("payout_amount", { required: true, min: 0 })}
                                disabled={isUpdating}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isUpdating}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="bg-poker-gold text-white hover:bg-poker-gold/90"
                            disabled={isUpdating}
                        >
                            {isUpdating && <Loader2 className="animate-spin mr-2" size={16} />}
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
