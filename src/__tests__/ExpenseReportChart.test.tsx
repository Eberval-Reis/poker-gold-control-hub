// Vitest Testing Library ambient types
import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import ExpenseReportChart from "@/components/report/ExpenseReportChart";

describe("ExpenseReportChart", () => {
  it("exibe mensagem nula se não houver dados", () => {
    render(<ExpenseReportChart data={[]} />);
    expect(screen.queryByText(/categoria/i)).not.toBeInTheDocument();
  });

  it("exibe o gráfico se houver dados", () => {
    render(
      <ExpenseReportChart
        data={[
          { category: "Transporte", amount: 100 },
          { category: "Alimentação", amount: 200 },
        ]}
      />
    );
    expect(screen.getByText(/Transporte/i)).toBeInTheDocument();
    expect(screen.getByText(/Alimentação/i)).toBeInTheDocument();
  });
});
