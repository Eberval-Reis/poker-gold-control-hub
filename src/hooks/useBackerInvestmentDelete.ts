
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export function useBackerInvestmentDelete() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
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
        title: "Erro ao excluir",
        description: error?.message ?? "Ocorreu um erro ao excluir o investimento.",
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
