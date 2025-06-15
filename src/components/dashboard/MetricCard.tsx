
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode; // Agora recebendo o ícone como elemento, não string!
  trend?: number;
  color?: "green" | "red";
  description?: string;
  loading?: boolean;
}

// Memoização: previne re-renderizações desnecessárias para métricas
const MetricCard: React.FC<MetricCardProps> = React.memo(({
  title,
  value,
  icon,
  trend,
  color,
  description,
  loading = false
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
            {description && <Skeleton className="h-4 w-full" />}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {/* Agora exibe APENAS o ícone visual, sem texto tipo "trophy" */}
              <span className="inline-flex">{icon}</span>
              <span className="text-sm font-medium text-muted-foreground">{title}</span>
              {typeof trend === "number" && (
                <span className={`ml-1 text-xs ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {trend > 0 ? "▲" : trend < 0 ? "▼" : "—"} {Math.abs(trend)}
                </span>
              )}
            </div>
            <div className={`text-2xl font-bold ${color === "green" ? "text-green-700" : color === "red" ? "text-red-700" : ""}`}>{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

MetricCard.displayName = "MetricCard";
export default MetricCard;

