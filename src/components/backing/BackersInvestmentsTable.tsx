import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useBackerInvestmentDelete } from "@/hooks/useBackerInvestmentDelete";
import { supabase } from "@/lib/supabase";
import EditInvestmentModal from "./EditInvestmentModal";
import { useUpdatePaymentStatus } from "@/hooks/useUpdatePaymentStatus";
import { toast } from "@/hooks/use-toast";

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
          map[id] = data.some((p: any) => p.backing_investment_id === id);
        }
      }
      setInvestmentsWithPayouts(map);
    }
    checkPayouts();
    return () => { cancelled = true; };
  }, [investments]);
  return investmentsWithPayouts;
}

interface Investment {
  id: string;
  backer_name: string;
  percentage_bought: number;
  amount_paid: number;
  payment_status: string | null;
}

interface BackersInvestmentsTableProps {
  investments: Investment[];
}

// Apenas visualização, sem toggle/click
const statusLabel = (
  status: string | null
) => {
  const isPending =
    !status || status.toLowerCase() === "pending" || status === "Pendente";
  return (
    <div
      className={
        "px-2 py-1 rounded flex items-center gap-1 min-w-[80px] bg-white border " +
        (isPending
          ? "border-yellow-500 text-yellow-600"
          : "border-green-500 text-green-600")
      }
      // não tem mais cursor pointer
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
      // Recomende-se atualizar react-query ou recarregar (forçando apenas update rápido)
      window.dispatchEvent(new Event('backing_investments_updated'));
      setEditing(null);
    } catch (e: any) {
      toast({ title: "Erro ao editar investimento", description: e.message, variant: "destructive" });
    }
    setUpdating(false);
  }

  // Trigger refresh externo sempre que invest atualizado
  React.useEffect(() => {
    const reload = () => { window.location.reload(); };
    window.addEventListener('backing_investments_updated', reload);
    return () => window.removeEventListener('backing_investments_updated', reload);
  }, []);

  return (
    <div className="border border-gray-200 rounded-b-md bg-white w-full">
      {/* Modal de edição */}
      <EditInvestmentModal
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        investment={editing}
        onSubmit={handleEditSubmit}
        isUpdating={updating}
      />
      <table className="w-full table-fixed text-sm text-gray-900">
        <colgroup>
          <col style={{ width: "32%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "18%" }} />
        </colgroup>
        <thead>
          <tr className="bg-muted">
            <th className="py-2 px-3 text-left align-middle">Nome</th>
            <th className="py-2 px-3 text-center align-middle">% Ação</th>
            <th className="py-2 px-3 text-center align-middle">Valor Pago</th>
            <th className="py-2 px-3 text-center align-middle">Status Pag.</th>
            <th className="py-2 px-3 text-right align-middle">Ações</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((b) => {
            const hasPayouts = investmentsWithPayouts[b.id];

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
                    {statusLabel(b.payment_status)}
                  </div>
                  {!hasPayouts && (
                    <span className="block mt-1 text-xs invisible">
                      {/* Não mostrar texto extra */}
                    </span>
                  )}
                  {/* antes era: (Não é possível alterar após cadastrar payout) */}
                </td>
                <td
                  className="py-2 px-3 text-right align-middle flex justify-end gap-1"
                  style={{ minWidth: 82 }}
                >
                  {/* Botão de edição é desabilitado ou ocultado se houver payouts */}
                  <div className="relative group">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-poker-gold hover:bg-gray-100 p-1"
                      disabled={!!hasPayouts}
                      title={
                        hasPayouts
                          ? "Não é possível editar pois já existem resultados vinculados a este investimento."
                          : "Editar investimento"
                      }
                      onClick={
                        hasPayouts
                          ? undefined
                          : () => setEditing({
                              id: b.id,
                              percentage_bought: b.percentage_bought,
                              amount_paid: b.amount_paid,
                              payment_status: b.payment_status,
                              backer_name: b.backer_name,
                            })
                      }
                    >
                      <Edit size={15} />
                    </Button>
                    {!!hasPayouts && (
                      <span className="pointer-events-none absolute z-10 left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Só é possível editar enquanto não houver resultados/payouts cadastrado.
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
                        variant="destructive"
                        className="p-1"
                        onClick={() => requestDelete(b.id)}
                      >
                        <Trash2 size={15} />
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
  );
};

export default BackersInvestmentsTable;
