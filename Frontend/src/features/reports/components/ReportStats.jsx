import React from 'react';
import MetricCard from './MetricCard';

export default function ReportStats({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
      {stats.map((stat) => (
        <MetricCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          isPositive={stat.isPositive}
          icon={stat.icon}
          color={stat.color}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  );
}
