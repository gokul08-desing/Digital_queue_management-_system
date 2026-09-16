import React from 'react';
import { getStatusDetails } from '../utils/timeUtils';

export default function StatusBadge({ status, size = 'normal' }) {
  const details = getStatusDetails(status);

  const sizeClasses = size === 'large'
    ? 'px-3 py-1.5 text-xs sm:text-sm font-semibold'
    : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${details.badgeBg} ${details.badgeText} ${details.badgeBorder} ${sizeClasses} shadow-2xs tracking-wide`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {details.label}
    </span>
  );
}
