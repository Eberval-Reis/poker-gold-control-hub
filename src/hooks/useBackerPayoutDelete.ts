
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export function useBackerPayoutDelete() {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("backer_payouts").delete().eq("id", id);
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            toast({
                title: "Retorno removido",
                description: "O registro de retorno foi excluído com sucesso.",
            });
            // Invalida várias queries para garantir que o dashboard e as tabelas atualizem
            queryClient.invalidateQueries({ queryKey: ["backing_investments"] });
            queryClient.invalidateQueries({ queryKey: ["backers_payout_table"] });
            queryClient.invalidateQueries({ queryKey: ["backing_dashboard_data"] });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Não foi possível excluir",
                description: error?.message ?? "Ocorreu um erro ao excluir o registro de retorno.",
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
