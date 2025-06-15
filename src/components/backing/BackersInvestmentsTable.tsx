
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useBackerInvestmentDelete } from "@/hooks/useBackerInvestmentDelete";
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

const statusLabel = (status: string | null) => {
  if (!status || status.toLowerCase() === "pending" || status === "Pendente")
    return (
      <span className="font-semibold text-yellow-600 flex items-center gap-1">
        <AlertTriangle size={16} /> Pendente
      </span>
    );
  return (
    <span className="font-semibold text-green-600 flex items-center gap-1">
      <Check size={16} /> Pago
    </span>
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

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-b-md bg-white">
      <table className="min-w-full text-sm text-gray-900">
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
            return (
            <tr key={b.id} className="border-t last:border-b-0">
              <td className="py-2 px-3 text-left align-middle">{b.backer_name}</td>
              <td className="py-2 px-3 text-center align-middle">{b.percentage_bought}%</td>
              <td className="py-2 px-3 text-center align-middle">
                R$ {b.amount_paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td className="py-2 px-3 text-center align-middle">
                <div className="flex items-center justify-center h-full w-full">{statusLabel(b.payment_status)}</div>
              </td>
              <td className="py-2 px-3 text-right align-middle flex justify-end gap-1" style={{ minWidth: 82 }}>
                {/* Botão de edição é desabilitado ou ocultado se houver payouts */}
                <div className="relative group">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-poker-gold hover:bg-gray-100 p-1"
                    disabled={!!hasPayouts}
                    title={hasPayouts ? "Não é possível editar pois já existem resultados vinculados a este investimento." : "Editar investimento"}
                  >
                    <Edit size={15} />
                  </Button>
                  {/* Tooltip customizado para dar feedback do porquê está desabilitado */}
                  {!!hasPayouts && (
                    <span className="pointer-events-none absolute z-10 left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Só é possível editar enquanto não houver resultados/payouts cadastrado.
                    </span>
                  )}
                </div>
                {/* ALERT DIALOG PARA CONFIRMAR EXCLUSÃO */}
                <AlertDialog open={deletingId === b.id} onOpenChange={(open) => !open && cancelDelete()}>
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
                        Tem certeza que deseja excluir este investimento?<br />
                        Esta ação não poderá ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={confirmDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-white"
                      >
                        {isDeleting ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
};

export default BackersInvestmentsTable;

