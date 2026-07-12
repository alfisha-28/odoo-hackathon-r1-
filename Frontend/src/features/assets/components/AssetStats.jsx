import React from 'react';
import StatCard from '../../dashboard/components/StatCard';

export default function AssetStats({ stats = [] }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          isPositive={stat.isPositive}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </section>
  );
}
