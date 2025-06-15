
import React from "react";
import { render, screen } from "@testing-library/react";
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
