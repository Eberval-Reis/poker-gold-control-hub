
import React from 'react';

type SummaryCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="card-poker flex items-center gap-4">
      <div className="rounded-full bg-poker-gold bg-opacity-10 p-3">
        {icon}
      </div>
      <div>
        <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
        <p className="text-xl font-bold">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SummaryCard;
