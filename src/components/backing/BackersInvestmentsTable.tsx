import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useBackerInvestmentDelete } from "@/hooks/useBackerInvestmentDelete";
import { supabase } from "@/lib/supabase";
import EditInvestmentModal from "./EditInvestmentModal";
import { useUpdatePaymentStatus } from "@/hooks/useUpdatePaymentStatus";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { BackingInvestment } from "@/hooks/useBackingInvestments";
import { useTheme } from "next-themes";

// Helper hook para buscar se existem payouts vinculados a cada investimento
function useInvestmentsWithPayouts(investments: { id: string }[]) {
  const [investmentsWithPayouts, setInvestmentsWithPayouts] = React.useState<Record<string, boolean>>({});
  React.useEffect(() => {
    let cancelled = false;
    async function checkPayouts() {
      if (!investments.length) {
        setInvestmentsWithPayouts({});
        return;
      }
      const ids = investments.map(inv => inv.id);
      // Consulta todos payouts vinculados aos investimentos fornecidos
      const { data, error } = await supabase
        .from("backer_payouts")
        .select("backing_investment_id")
        .in("backing_investment_id", ids);
      if (cancelled) return;
      const map: Record<string, boolean> = {};
      if (!error && data) {
        for (const id of ids) {
          map[id] = data.some((p) => p.backing_investment_id === id);
        }
      }
      setInvestmentsWithPayouts(map);
    }
    checkPayouts();
    return () => { cancelled = true; };
  }, [investments]);
  return investmentsWithPayouts;
}

interface Investment extends BackingInvestment {
  buy_in_amount?: number;
  markup_percentage?: number;
}

interface BackersInvestmentsTableProps {
  investments: BackingInvestment[];
}

// Apenas visualização, sem toggle/click
const statusLabel = (
  status: string | null,
  isDark: boolean
) => {
  const isPending =
    !status || status.toLowerCase() === "pending" || status === "Pendente";
  return (
    <div
      className={
        "px-2 py-1 rounded flex items-center gap-1 min-w-[80px] border " +
        (isPending
          ? "border-yellow-500 text-yellow-600"
          : "border-green-500 text-green-600")
      }
      style={{ background: isDark ? 'hsl(222, 47%, 10%)' : 'hsl(0,0%,100%)' }}
    >
      {isPending ? (
        <>
          <AlertTriangle size={16} />
          Pendente
        </>
      ) : (
        <>
          <Check size={16} />
          Pago
        </>
      )}
    </div>
  );
};

const BackersInvestmentsTable: React.FC<BackersInvestmentsTableProps> = ({
  investments,
}) => {
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = React.useState(
    () => typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  );
  React.useEffect(() => {
    if (resolvedTheme) setIsDark(resolvedTheme === 'dark');
  }, [resolvedTheme]);
  const {
    deletingId,
    requestDelete,
    confirmDelete,
    cancelDelete,
    isDeleting,
  } = useBackerInvestmentDelete();

  const investmentsWithPayouts = useInvestmentsWithPayouts(investments);

  // Controle modal edição
  const [editing, setEditing] = React.useState<null | Investment>(null);
  const [updating, setUpdating] = React.useState(false);

  const queryClient = useQueryClient();

  // Buscar oferta relacionada ao investimento para o modal de edição
  function getOfferValues(inv: Investment) {
    const offer = (b: Investment) => b.offer || b;
    return (b: Investment) => ({
      buy_in_amount: offer(b).buy_in_amount || 0,
      markup_percentage: offer(b).markup_percentage || 1,
    });
  }

  // Alternativa: utilize a mutation (por simplicidade faremos simples update direto + reload)
  const { updatePaymentStatus } = useUpdatePaymentStatus();

  async function handleEditSubmit(values: { percentage_bought: number; amount_paid: number; payment_status: string }) {
    if (!editing) return;
    setUpdating(true);
    const { id } = editing;
    try {
      // Update no Supabase: só nos campos editáveis
      const { error } = await supabase
        .from("backing_investments")
        .update({
          percentage_bought: values.percentage_bought,
          amount_paid: values.amount_paid,
          payment_status: values.payment_status,
        })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Investimento editado com sucesso!" });

      // Atualiza a query de investimentos para refletir mudanças instantaneamente
      await queryClient.invalidateQueries({
        queryKey: ["backing_investments"],
      });

      setEditing(null);
    } catch (e: unknown) {
      const error = e as Error;
      toast({ title: "Erro ao editar investimento", description: error.message, variant: "destructive" });
    }
    setUpdating(false);
  }

  return (
    <div
      className="border-x border-b border-border w-full overflow-x-auto"
      style={{ background: isDark ? 'hsl(222, 47%, 7%)' : 'hsl(0, 0%, 100%)', color: isDark ? 'hsl(210, 40%, 98%)' : 'hsl(220, 20%, 10%)' }}
    >
      <div className="min-w-[550px]">
        {/* Modal de edição */}
        <EditInvestmentModal
          open={!!editing}
          onOpenChange={(v) => !v && setEditing(null)}
          investment={
            editing
              ? {
                ...editing,
                // pegar os valores corretos
                buy_in_amount: editing.buy_in_amount,
                markup_percentage: editing.markup_percentage,
              }
              : null
          }
          buy_in_amount={editing?.buy_in_amount}
          markup_percentage={editing?.markup_percentage}
          onSubmit={handleEditSubmit}
          isUpdating={updating}
        />
        <table className="w-full table-fixed text-sm text-foreground dark:text-foreground">
          <colgroup>
            <col style={{ width: "32%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr style={{ background: isDark ? 'hsl(222, 47%, 12%)' : 'hsl(220, 15%, 96%)' }}>
              <th className="py-2 px-3 text-left align-middle">Nome</th>
              <th className="py-2 px-3 text-center align-middle">% Ação</th>
              <th className="py-2 px-3 text-center align-middle">Valor Pago</th>
              <th className="py-2 px-3 text-center align-middle">Status Pag.</th>
              <th className="py-2 px-3 text-right align-middle">Ações</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((b: BackingInvestment) => {
              const hasPayouts = investmentsWithPayouts[b.id];
              // Pegue informações do buy_in e markup através de offer (ver fetchBackingInvestments)
              const buy_in_amount = b.offer?.buy_in_amount ?? 0;
              const markup_percentage = b.offer?.markup_percentage ?? 1;

              return (
                <tr key={b.id} className="border-t last:border-b-0">
                  <td className="py-2 px-3 text-left align-middle text-ellipsis whitespace-nowrap overflow-hidden">
                    {b.backer_name}
                  </td>
                  <td className="py-2 px-3 text-center align-middle">
                    {b.percentage_bought}%
                  </td>
                  <td className="py-2 px-3 text-center align-middle">
                    R${" "}
                    {b.amount_paid.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-3 text-center align-middle">
                    <div className="flex items-center justify-center h-full w-full">
                      {/* Status agora é apenas visual */}
                      {statusLabel(b.payment_status, isDark)}
                    </div>
                  </td>
                  <td
                    className="py-2 px-3 text-right align-middle flex justify-end gap-1"
                    style={{ minWidth: 82 }}
                  >
                    {/* Botão de edição */}
                    <div className="relative group">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-poker-gold hover:bg-accent/50"
                        disabled={!!hasPayouts}
                        title={
                          hasPayouts
                            ? "Não é possível editar pois já existem resultados vinculados a este investimento."
                            : "Editar investimento"
                        }
                        onClick={
                          hasPayouts
                            ? undefined
                            : () =>
                              setEditing({
                                ...b,
                                buy_in_amount,
                                markup_percentage,
                              })
                        }
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      {!!hasPayouts && (
                        <span className="pointer-events-none absolute z-10 left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Ineditável (payouts ativos)
                        </span>
                      )}
                    </div>
                    {/* ALERT DIALOG PARA CONFIRMAR EXCLUSÃO */}
                    <AlertDialog
                      open={deletingId === b.id}
                      onOpenChange={(open) => !open && cancelDelete()}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => requestDelete(b.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este investimento?
                            <br />
                            Esta ação não poderá ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-white"
                          >
                            {isDeleting ? (
                              <Loader2 className="animate-spin mr-2" size={16} />
                            ) : null}
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BackersInvestmentsTable;
