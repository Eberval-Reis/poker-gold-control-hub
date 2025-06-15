
import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import ExpenseReportTable from "@/components/report/ExpenseReportTable";

const expenses = [
  {
    id: "1",
    type: "Transporte",
    amount: 100,
    date: "2024-06-10T13:00:00.000Z",
    tournaments: { name: "Torneio XPTO" },
  },
  {
    id: "2",
    type: "Alimentação",
    amount: 50,
    date: "2024-06-12T13:00:00.000Z",
    tournaments: { name: "Torneio Bru" },
  },
];

describe("ExpenseReportTable", () => {
  it("renderiza corretamente a tabela com despesas", () => {
    render(<ExpenseReportTable expenses={expenses} />);
    expect(screen.getByText(/Torneio XPTO/)).toBeInTheDocument();
    expect(screen.getByText(/Torneio Bru/)).toBeInTheDocument();
    expect(screen.getByText(/Transporte/)).toBeInTheDocument();
    expect(screen.getByText(/Alimentação/)).toBeInTheDocument();
    expect(screen.getByText("R$ 100,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 50,00")).toBeInTheDocument();
  });

  it("exibe mensagem de vazio corretamente", () => {
    render(<ExpenseReportTable expenses={[]} />);
    expect(screen.getByText(/Nenhuma despesa encontrada/i)).toBeInTheDocument();
  });
});
