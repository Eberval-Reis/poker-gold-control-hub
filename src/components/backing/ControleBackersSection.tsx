
import React from "react";
import { Button } from "@/components/ui/button";

const DUMMY = [
  { nome: "Carlos", perc: 50, valor: 7500, status: "Pago" },
  { nome: "Ana", perc: 20, valor: 3000, status: "Pendente" },
];

const ControleBackersSection = () => {
  const total = DUMMY.reduce((a, b) => a + b.valor, 0);
  const buyin = 10000;

  return (
    <div className="space-y-5 max-w-2xl">
      <h2 className="text-xl font-semibold">Controle de Backers</h2>
      <table className="min-w-full bg-white shadow rounded border">
        <thead>
          <tr className="bg-muted">
            <th className="py-2 px-3 text-left">Nome</th>
            <th className="py-2 px-3">% Ação</th>
            <th className="py-2 px-3">Valor Pago</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {DUMMY.map((b, i) => (
            <tr key={i} className="border-t">
              <td className="py-2 px-3">{b.nome}</td>
              <td className="py-2 px-3">{b.perc}%</td>
              <td className="py-2 px-3">R$ {b.valor.toLocaleString()}</td>
              <td className="py-2 px-3">
                {b.status === "Pago" ? (
                  <span className="text-green-600 font-semibold">✅ Pago</span>
                ) : (
                  <span className="text-yellow-600 font-semibold">⚠️ Pendente</span>
                )}
              </td>
              <td className="py-2 px-3">
                <Button size="sm" variant="ghost">✏️</Button>
                <Button size="sm" variant="destructive">🗑️</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end items-center gap-4 mt-2">
        <span className="font-bold">
          Total Arrecadado: R$ {total.toLocaleString()} ({((total / buyin) * 100).toFixed(0)}% do buy-in)
        </span>
      </div>
    </div>
  );
};

export default ControleBackersSection;
