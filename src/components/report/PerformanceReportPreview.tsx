
import React from "react";
import PrizeBarChart from "./PrizeBarChart";

import { PokerPerformance } from '@/types';

interface PokerPerformanceReportPreviewProps {
  performances: PokerPerformance[];
  periodRange: { start: Date; end: Date };
}

const PokerPerformanceReportPreview: React.FC<PokerPerformanceReportPreviewProps> = ({
  performances,
  periodRange
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-poker-text-dark">
        Relatório de Desempenho em Torneios
      </h3>
      <div className="mb-3">
        Torneios jogados no período:{" "}
        <span className="font-bold">{performances.length}</span>
      </div>
      <PrizeBarChart performances={performances} />
      <div className="bg-muted p-4 rounded text-muted-foreground text-center">
        (Gráficos e análises detalhadas em breve!)
      </div>
      <div className="text-xs text-muted-foreground mt-3 text-right">
        Período: {periodRange.start.toLocaleDateString()} a {periodRange.end.toLocaleDateString()}
      </div>
    </div>
  );
};

export default PokerPerformanceReportPreview;
