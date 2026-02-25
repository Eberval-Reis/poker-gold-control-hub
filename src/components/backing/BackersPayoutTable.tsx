
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditPayoutModal from "./EditPayoutModal";
import { useBackerPayoutDelete } from "@/hooks/useBackerPayoutDelete";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface PayoutRow {
  id: string; // investment_id
  payout_id: string | null;
  tournament: string;
  event?: string | null;
  player: string;
  backer: string;
  percentage: number;
  invested: number;
  payout: number | null;
  roi: number | null;
}

async function fetchBackersPayoutTable(): Promise<PayoutRow[]> {
  const { data, error } = await supabase
    .from("backing_investments")
    .select(`
      *,
      backing_offers (
        tournaments (
          name,
          schedule_events (name)
        ),
        player_name
      ),
      backer_payouts:backer_payouts!backing_investment_id(*)
    `);

  if (error) throw error;

  return (data ?? []).map((item) => ({
    id: item.id,
    payout_id:
      (item.backer_payouts?.length ?? 0) > 0
        ? item.backer_payouts[0].id
        : null,
    tournament:
      item.backing_offers?.tournaments?.name ??
      `Torneio ${item.backing_offer_id?.slice(-4)}`,
    event: item.backing_offers?.tournaments?.schedule_events?.name ?? null,
    player: item.backing_offers?.player_name ?? "-",
    backer: item.backer_name,
    percentage: item.percentage_bought,
    invested: Number(item.amount_paid ?? 0),
    payout:
      (item.backer_payouts?.length ?? 0) > 0
        ? Number(item.backer_payouts[0]?.payout_amount ?? 0)
        : null,
    roi:
      (item.backer_payouts?.length ?? 0) > 0
        ? Number(item.backer_payouts[0]?.roi_percentage ?? 0)
        : null,
  }));
}

const BackersPayoutTable: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["backers_payout_table"],
    queryFn: fetchBackersPayoutTable,
  });

  const {
    deletingId,
    requestDelete,
    confirmDelete,
    cancelDelete,
    isDeleting,
  } = useBackerPayoutDelete();

  const [editing, setEditing] = React.useState<{
    id: string;
    payout_amount: number;
    investment_id: string;
  } | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleEditSubmit = async (values: { payout_amount: number }) => {
    if (!editing) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("backer_payouts")
        .update({ payout_amount: values.payout_amount })
        .eq("id", editing.id);

      if (error) throw error;

      toast({ title: "Retorno atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["backers_payout_table"] });
      queryClient.invalidateQueries({ queryKey: ["backing_dashboard_data"] });
      queryClient.invalidateQueries({ queryKey: ["backing_investments"] });
      setEditing(null);
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar retorno",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 flex justify-center text-poker-gold">
        <Loader2 className="animate-spin mr-2" />
        Carregando dados dos payouts...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Erro ao buscar dados dos payouts.
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="text-center my-10 text-muted-foreground">
        Nenhum payout registrado ainda.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-w-full -mx-0 scrollbar-thin">
      <EditPayoutModal
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        payout={editing}
        onSubmit={handleEditSubmit}
        isUpdating={isUpdating}
      />

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(v) => !v && cancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este retorno? Esta ação tornará o investimento editável novamente na aba "Controle de Backers".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <table className="w-full text-[9px] sm:text-sm min-w-[400px] sm:min-w-[600px]">
        <thead>
          <tr className="bg-muted border-b">
            <th className="py-1 sm:py-2 px-1 sm:px-3 text-left align-middle font-medium">Torneio</th>
            <th className="py-1 sm:py-2 px-1 sm:px-3 text-left align-middle font-medium">Backer</th>
            <th className="py-1 sm:py-2 px-1 sm:px-3 text-center align-middle font-medium">% Ação</th>
            <th className="py-1 sm:py-2 px-1 sm:px-3 text-right align-middle font-medium whitespace-nowrap">Investido</th>
            <th className="py-1 sm:py-2 px-1 sm:px-3 text-right align-middle font-medium">Retorno</th>
            <th className="py-1 sm:py-2 px-1 sm:px-3 text-right align-middle font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b last:border-0 hover:bg-muted/50">
              <td className="py-2 px-1 sm:px-3 text-left align-middle max-w-[100px] sm:max-w-[150px] break-words">
                {row.tournament}
              </td>
              <td className="py-2 px-1 sm:px-3 text-left align-middle truncate max-w-[80px] sm:max-w-none">
                {row.backer}
              </td>
              <td className="py-2 px-1 sm:px-3 text-center align-middle">
                {row.percentage}%
              </td>
              <td className="py-2 px-1 sm:px-3 text-right align-middle whitespace-nowrap">
                R$ {row.invested.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </td>
              <td className="py-2 px-1 sm:px-3 text-right align-middle">
                {row.payout !== null
                  ? <span className={row.payout - row.invested >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    R$ {row.payout.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  : <span className="text-muted-foreground">-</span>
                }
              </td>
              <td className="py-2 px-1 sm:px-3 text-right align-middle">
                <div className="flex justify-end gap-1">
                  {row.payout_id && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-poker-gold"
                        onClick={() => setEditing({
                          id: row.payout_id!,
                          payout_amount: row.payout!,
                          investment_id: row.id
                        })}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => requestDelete(row.payout_id!)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackersPayoutTable;
