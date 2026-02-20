
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Edit, Trash2, MoreHorizontal, DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import EditPayoutModal from "./EditPayoutModal";
import EditInvestmentModal from "./EditInvestmentModal";

interface PayoutRow {
  id: string; // backing_investment_id
  tournament: string;
  event?: string | null;
  player: string;
  backer: string;
  percentage_bought: number;
  amount_paid: number;
  payout: number | null;
  roi: number | null;
  payout_id: string | null;
  payment_status: string | null;
  buy_in_amount: number;
  markup_percentage: number;
}

async function fetchBackersPayoutTable(): Promise<PayoutRow[]> {
  const { data, error } = await supabase
    .from("backing_investments")
    .select(`
      *,
      backing_offers (
        buy_in_amount,
        markup_percentage,
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
    tournament:
      item.backing_offers?.tournaments?.name ??
      `Torneio ${item.backing_offer_id?.slice(-4)}`,
    event: item.backing_offers?.tournaments?.schedule_events?.name ?? null,
    player: item.backing_offers?.player_name ?? "-",
    backer: item.backer_name,
    percentage_bought: item.percentage_bought,
    amount_paid: Number(item.amount_paid ?? 0),
    payout:
      (item.backer_payouts?.length ?? 0) > 0
        ? Number(item.backer_payouts[0]?.payout_amount ?? 0)
        : null,
    roi:
      (item.backer_payouts?.length ?? 0) > 0
        ? Number(item.backer_payouts[0]?.roi_percentage ?? 0)
        : null,
    payout_id:
      (item.backer_payouts?.length ?? 0) > 0
        ? item.backer_payouts[0].id
        : null,
    payment_status: item.payment_status,
    buy_in_amount: item.backing_offers?.buy_in_amount ?? 0,
    markup_percentage: item.backing_offers?.markup_percentage ?? 1,
  }));
}

const BackersPayoutTable: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["backers_payout_table"],
    queryFn: fetchBackersPayoutTable,
  });

  const [editingPayout, setEditingPayout] = React.useState<null | { id: string; payout_amount: number; investment_id: string }>(null);
  const [editingInvestment, setEditingInvestment] = React.useState<null | PayoutRow>(null);
  const [deletingPayoutId, setDeletingPayoutId] = React.useState<string | null>(null);
  const [deletingInvestmentId, setDeletingInvestmentId] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleDeletePayout = async () => {
    if (!deletingPayoutId) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("backer_payouts")
        .delete()
        .eq("id", deletingPayoutId);

      if (error) throw error;
      toast({ title: "Retorno excluído com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["backers_payout_table"] });
      queryClient.invalidateQueries({ queryKey: ["backing_dashboard_data"] });
    } catch (e: any) {
      toast({ title: "Erro ao excluir retorno", description: e.message, variant: "destructive" });
    } finally {
      setIsUpdating(false);
      setDeletingPayoutId(null);
    }
  };

  const handleDeleteInvestment = async () => {
    if (!deletingInvestmentId) return;
    setIsUpdating(true);
    try {
      // Deletar também os payouts relacionados (se não houver cascade)
      await supabase.from("backer_payouts").delete().eq("backing_investment_id", deletingInvestmentId);

      const { error } = await supabase
        .from("backing_investments")
        .delete()
        .eq("id", deletingInvestmentId);

      if (error) throw error;
      toast({ title: "Investimento excluído com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["backers_payout_table"] });
      queryClient.invalidateQueries({ queryKey: ["backing_dashboard_data"] });
    } catch (e: any) {
      toast({ title: "Erro ao excluir investimento", description: e.message, variant: "destructive" });
    } finally {
      setIsUpdating(false);
      setDeletingInvestmentId(null);
    }
  };

  const handleEditPayoutSubmit = async (values: { payout_amount: number }) => {
    if (!editingPayout) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("backer_payouts")
        .update({ payout_amount: values.payout_amount })
        .eq("id", editingPayout.id);

      if (error) throw error;
      toast({ title: "Retorno atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["backers_payout_table"] });
      queryClient.invalidateQueries({ queryKey: ["backing_dashboard_data"] });
      setEditingPayout(null);
    } catch (e: any) {
      toast({ title: "Erro ao atualizar retorno", description: e.message, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditInvestmentSubmit = async (values: { percentage_bought: number; amount_paid: number; payment_status: string }) => {
    if (!editingInvestment) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("backing_investments")
        .update({
          percentage_bought: values.percentage_bought,
          amount_paid: values.amount_paid,
          payment_status: values.payment_status,
        })
        .eq("id", editingInvestment.id);

      if (error) throw error;
      toast({ title: "Investimento atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["backers_payout_table"] });
      queryClient.invalidateQueries({ queryKey: ["backing_dashboard_data"] });
      setEditingInvestment(null);
    } catch (e: any) {
      toast({ title: "Erro ao atualizar investimento", description: e.message, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 flex justify-center text-poker-gold font-medium">
        <Loader2 className="animate-spin mr-2" />
        Carregando dados dos payouts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">
        Erro ao buscar dados dos payouts.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground italic">
        Nenhum payout registrado ainda.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-between px-3 py-3 border-b border-border bg-muted/30">
        <h3 className="text-xs sm:text-sm font-semibold text-poker-gold uppercase tracking-wider">Investimento & Retorno</h3>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-poker-gold text-poker-gold hover:bg-poker-gold hover:text-white"
          onClick={() => toast({ title: "Funcionalidade em desenvolvimento", description: "Por favor, utilize a aba 'Vender Ações' para cadastrar novos investimentos." })}
        >
          <Plus className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Novo Investimento</span><span className="sm:hidden">Novo</span>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] sm:text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="py-3 px-2 sm:px-4 text-left font-semibold text-muted-foreground uppercase tracking-wider">Torneio</th>
              <th className="py-3 px-2 sm:px-4 text-left font-semibold text-muted-foreground uppercase tracking-wider">Backer</th>
              <th className="py-3 px-2 sm:px-4 text-center font-semibold text-muted-foreground uppercase tracking-wider">% Ações</th>
              <th className="py-3 px-2 sm:px-4 text-right font-semibold text-muted-foreground uppercase tracking-wider">Investido</th>
              <th className="py-3 px-2 sm:px-4 text-right font-semibold text-muted-foreground uppercase tracking-wider">Retorno</th>
              <th className="py-3 px-2 sm:px-4 text-center font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2 px-2 sm:px-4 text-left align-middle max-w-[100px] sm:max-w-[150px] truncate font-medium">
                  {row.tournament}
                </td>
                <td className="py-2 px-2 sm:px-4 text-left align-middle whitespace-nowrap">
                  {row.backer}
                </td>
                <td className="py-2 px-2 sm:px-4 text-center align-middle">
                  {row.percentage_bought}%
                </td>
                <td className="py-2 px-2 sm:px-4 text-right align-middle whitespace-nowrap font-mono">
                  R$ {row.amount_paid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-2 sm:px-4 text-right align-middle whitespace-nowrap font-mono font-bold">
                  {row.payout !== null
                    ? <span className={row.payout - row.amount_paid >= 0 ? "text-green-600" : "text-red-600"}>
                      R$ {row.payout.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    : <span className="text-muted-foreground">-</span>
                  }
                </td>
                <td className="py-2 px-2 sm:px-4 text-center align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingInvestment(row)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Investimento
                      </DropdownMenuItem>
                      {row.payout_id && (
                        <DropdownMenuItem onClick={() => setEditingPayout({ id: row.payout_id!, payout_amount: row.payout!, investment_id: row.id })}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Editar Retorno
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setDeletingInvestmentId(row.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Tudo
                      </DropdownMenuItem>
                      {row.payout_id && (
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setDeletingPayoutId(row.payout_id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir Apenas Retorno
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditPayoutModal
        open={!!editingPayout}
        onOpenChange={(v) => !v && setEditingPayout(null)}
        payout={editingPayout}
        onSubmit={handleEditPayoutSubmit}
        isUpdating={isUpdating}
      />

      <EditInvestmentModal
        open={!!editingInvestment}
        onOpenChange={(v) => !v && setEditingInvestment(null)}
        investment={editingInvestment}
        buy_in_amount={editingInvestment?.buy_in_amount}
        markup_percentage={editingInvestment?.markup_percentage}
        onSubmit={handleEditInvestmentSubmit}
        isUpdating={isUpdating}
      />

      <AlertDialog open={!!deletingPayoutId} onOpenChange={(v) => !v && setDeletingPayoutId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Retorno?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso apagará apenas o valor do prêmio/retorno deste backer. O investimento continuará existindo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePayout}
              disabled={isUpdating}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingInvestmentId} onOpenChange={(v) => !v && setDeletingInvestmentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tudo?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso apagará o investimento e qualquer retorno vinculado. Esta ação é irreversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvestment}
              disabled={isUpdating}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BackersPayoutTable;
