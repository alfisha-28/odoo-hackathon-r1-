import React from 'react';
import StatsCard from './StatsCard';

export default function NotificationStats({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {stats.map((stat) => (
        <StatsCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
