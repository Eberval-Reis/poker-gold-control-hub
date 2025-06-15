
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export function useBackerInvestmentDelete() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      // Passo extra: checar se existem payouts vinculados
      const { data: payouts, error: payoutError } = await supabase
        .from("backer_payouts")
        .select("id")
        .eq("backing_investment_id", id);

      if (payoutError) {
        throw new Error("Erro ao verificar payouts vinculados.");
      }
      if (payouts && payouts.length > 0) {
        throw new Error("Não é possível excluir o investimento: existem payouts vinculados a este investimento.");
      }

      const { error } = await supabase.from("backing_investments").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({
        title: "Investimento removido",
        description: "O investimento do backer foi excluído com sucesso.",
      });
      queryClient.invalidateQueries({queryKey: ["backing_investments"]});
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Não foi possível excluir",
        description:
          error?.message ??
          "Ocorreu um erro ao excluir o investimento. Verifique se há payouts vinculados.",
      });
    }
  });

  const requestDelete = (id: string) => setDeletingId(id);
  const confirmDelete = async () => {
    if (deletingId) {
      await mutation.mutateAsync(deletingId);
      setDeletingId(null);
    }
  };
  const cancelDelete = () => setDeletingId(null);

  return {
    deletingId,
    requestDelete,
    confirmDelete,
    cancelDelete,
    isDeleting: mutation.isPending,
  };
}
