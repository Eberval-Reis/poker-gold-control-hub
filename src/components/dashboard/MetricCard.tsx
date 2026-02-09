
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
    <Card className="overflow-hidden border-border/40 hover:border-poker-gold/40 transition-all duration-500 hover:shadow-gold-glow animate-reveal group">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          {icon}
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
            {description && <Skeleton className="h-4 w-full" />}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-poker-gold">{icon}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
              </div>
              {typeof trend === "number" && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                  {trend > 0 ? "+" : ""}{trend}%
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <div className={`text-3xl font-extrabold font-montserrat tracking-tight ${color === "green" ? "text-green-500" : color === "red" ? "text-red-500" : "text-foreground"}`}>
                {value}
              </div>
              {description && <p className="text-[10px] mt-1 text-muted-foreground font-medium uppercase tracking-tight">{description}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

MetricCard.displayName = "MetricCard";
export default MetricCard;

