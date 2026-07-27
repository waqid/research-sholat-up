import React from 'react';
import { FormattedPrayerTimes } from '../../lib/astronomy/meeus.ts';
import { PrayerCard } from './PrayerCard.tsx';

export function PrayerGrid({ times, activeKey }: { times: FormattedPrayerTimes; activeKey: string }): React.JSX.Element {
  const cards = [
    { key: 'subuh', label: 'Subuh', time: times.subuh },
    { key: 'terbit', label: 'Terbit', time: times.terbit, isTerbit: true },
    { key: 'dhuhur', label: 'Dhuhur', time: times.dhuhur },
    { key: 'ashar', label: 'Ashar', time: times.ashar },
    { key: 'maghrib', label: 'Maghrib', time: times.maghrib },
    { key: 'isya', label: "Isya'", time: times.isya }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
      {cards.map(c => (
        <PrayerCard
          key={c.key}
          name={c.label}
          time={c.time}
          isActive={activeKey === c.key}
          isTerbit={c.isTerbit}
        />
      ))}
    </div>
  );
}
