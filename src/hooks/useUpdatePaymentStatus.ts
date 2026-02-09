
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      newStatus,
    }: {
      id: string;
      newStatus: string;
    }) => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from("backing_investments")
        .update({ payment_status: newStatus })
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({
        title: "Status atualizado",
        description: "O status do pagamento foi atualizado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["backing_investments"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: error?.message ?? "Não foi possível atualizar o status.",
      });
    },
  });

  return {
    updatePaymentStatus: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
