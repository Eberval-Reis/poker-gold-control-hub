import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useBackerInvestmentDelete } from "@/hooks/useBackerInvestmentDelete";
import { useUpdatePaymentStatus } from "@/hooks/useUpdatePaymentStatus";
import { supabase } from "@/lib/supabase";

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

const statusLabel = (
  status: string | null,
  onToggle?: (() => void) | null,
  isLoading?: boolean
) => {
  const isPending =
    !status || status.toLowerCase() === "pending" || status === "Pendente";
  return (
    <Button
      size="sm"
      variant={isPending ? "outline" : "ghost"}
      className={
        (isPending
          ? "border-yellow-500 text-yellow-600"
          : "border-green-500 text-green-600") +
        " px-2 py-1 rounded flex items-center gap-1 min-w-[80px] bg-white"
      }
      style={{ cursor: onToggle ? "pointer" : undefined }}
      onClick={onToggle ?? undefined}
      disabled={!onToggle || isLoading}
      title={
        isPending
          ? "Marcar como pago"
          : "Marcar como pendente"
      }
    >
      {isLoading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : isPending ? (
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
    </Button>
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
  const [changingId, setChangingId] = React.useState<string | null>(null);
  const { updatePaymentStatus, isUpdating } = useUpdatePaymentStatus();

  // Dialog de confirmação de mudança:
  const [confirmDialog, setConfirmDialog] = React.useState<{
    id: string;
    toStatus: string;
  } | null>(null);

  return (
    <div className="border border-gray-200 rounded-b-md bg-white w-full">
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
            <th className="py-2 px-3 text-center align-middle">Status</th>
            <th className="py-2 px-3 text-right align-middle">Ações</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((b) => {
            const hasPayouts = investmentsWithPayouts[b.id];

            // Determina status atual
            const isPending =
              !b.payment_status ||
              b.payment_status.toLowerCase() === "pending" ||
              b.payment_status === "Pendente";

            // Desabilita troca de status se tiver payout já cadastrado
            const canToggleStatus = !hasPayouts;

            const handleToggleStatus = () => {
              if (!canToggleStatus || isUpdating || changingId) return;
              // Confirma antes de alterar status para Pago
              const toStatus = isPending ? "Pago" : "Pendente";
              setConfirmDialog({ id: b.id, toStatus });
            };

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
                    {/* Status pode ser clicável para alternar, mas só se não há payout */}
                    {statusLabel(
                      b.payment_status,
                      canToggleStatus ? handleToggleStatus : null,
                      changingId === b.id && isUpdating
                    )}
                  </div>
                  {!canToggleStatus && (
                    <span className="block mt-1 text-xs text-muted-foreground">
                      (Não é possível alterar após cadastrar payout)
                    </span>
                  )}
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
      {/* Diálogo de confirmação de alteração de status */}
      {confirmDialog && (
        <AlertDialog open onOpenChange={() => setConfirmDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialog.toStatus === "Pago"
                  ? "Marcar como Pago?"
                  : "Marcar como Pendente?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja marcar este investimento como{" "}
                <b>{confirmDialog.toStatus}</b>?<br />
                {confirmDialog.toStatus === "Pago"
                  ? "Ao confirmar, o status será alterado para Pago."
                  : "O status voltará para Pendente."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isUpdating}
                onClick={() => setConfirmDialog(null)}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isUpdating}
                className="bg-primary text-white"
                onClick={async () => {
                  setChangingId(confirmDialog.id);
                  await updatePaymentStatus({
                    id: confirmDialog.id,
                    newStatus: confirmDialog.toStatus,
                  });
                  setChangingId(null);
                  setConfirmDialog(null);
                }}
              >
                {isUpdating && changingId === confirmDialog.id ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : null}
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default BackersInvestmentsTable;
