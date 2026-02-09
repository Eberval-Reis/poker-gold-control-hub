
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonsProps {
  tableData: Record<string, unknown>[];
  columns: { label: string; key: string }[];
  filePrefix: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  tableData,
  columns,
  filePrefix
}) => {
  // Exportar CSV simplificado
  function exportCSV() {
    const rows = [
      columns.map(col => `"${col.label}"`).join(",") // Header
    ];
    tableData.forEach(row => {
      rows.push(
        columns
          .map(col => `"${(row[col.key] ?? "").toString().replace(/"/g, '""')}"`)
          .join(",")
      );
    });
    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Exportar PDF com jsPDF + autotable
  function exportPDF() {
    const doc = new jsPDF();
    doc.text(`${filePrefix} - Relatório`, 14, 18);
    autoTable(doc, {
      startY: 22,
      head: [columns.map(col => col.label)],
      body: tableData.map(row => columns.map(col => row[col.key])),
      theme: "grid"
    });
    doc.save(`${filePrefix}-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return (
    <div className="flex gap-2 mb-3">
      <Button
        variant="outline"
        onClick={exportPDF}
        title="Exportar PDF"
        size="sm"
        className="gap-1"
      >
        <FileText className="w-4 h-4" />
        PDF
      </Button>
      <Button
        variant="outline"
        onClick={exportCSV}
        title="Exportar CSV"
        size="sm"
        className="gap-1"
      >
        <Download className="w-4 h-4" />
        CSV
      </Button>
    </div>
  );
};

export default ExportButtons;
