
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  colorClass?: string;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  description,
  colorClass = '',
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
              {icon}
              <span className="text-sm font-medium text-muted-foreground">{title}</span>
            </div>
            <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
