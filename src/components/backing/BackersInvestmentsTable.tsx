
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertTriangle, Edit, Trash2 } from "lucide-react";

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
          {investments.map((b) => (
            <tr key={b.id} className="border-t last:border-b-0">
              <td className="py-2 px-3 text-left align-middle">{b.backer_name}</td>
              <td className="py-2 px-3 text-center align-middle">{b.percentage_bought}%</td>
              <td className="py-2 px-3 text-center align-middle">
                R$ {b.amount_paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td className="py-2 px-3 text-center align-middle">
                <div className="flex items-center justify-center h-full w-full">{statusLabel(b.payment_status)}</div>
              </td>
              <td className="py-2 px-3 text-right align-middle flex justify-end gap-1">
                <Button size="sm" variant="ghost" className="text-poker-gold hover:bg-gray-100 p-1">
                  <Edit size={15} />
                </Button>
                <Button size="sm" variant="destructive" className="p-1">
                  <Trash2 size={15} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackersInvestmentsTable;
