// Utility functions for queue timings, ETA calculation, and arrival window display

/**
 * Generates an arrival window string based on current date + estimated wait minutes
 * @param {number} waitMinutes 
 * @returns {{ start: string, end: string, display: string }}
 */
export function calculateArrivalWindow(waitMinutes) {
  if (waitMinutes <= 3) {
    return {
      start: "Now",
      end: "Immediate",
      display: "Please arrive now"
    };
  }

  const now = new Date();
  const startTime = new Date(now.getTime() + Math.max(0, waitMinutes - 5) * 60000);
  const endTime = new Date(now.getTime() + waitMinutes * 60000);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const start = formatTime(startTime);
  const end = formatTime(endTime);

  return {
    start,
    end,
    display: `${start} - ${end}`
  };
}

/**
 * Returns human-readable status metadata
 */
export function getStatusDetails(status) {
  switch (status) {
    case 'WAITING':
      return {
        label: 'In Queue',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200',
        iconColor: 'text-blue-600',
        description: 'You are safely in line. We will notify you when your turn approaches.'
      };
    case 'APPROACHING':
      return {
        label: 'Turn Approaching',
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-800',
        badgeBorder: 'border-amber-300',
        iconColor: 'text-amber-600',
        description: 'Only 2 people ahead. Please start moving towards the registration area.'
      };
    case 'COME_NOW':
      return {
        label: 'Arrive Now',
        badgeBg: 'bg-orange-50',
        badgeText: 'text-orange-800',
        badgeBorder: 'border-orange-300',
        iconColor: 'text-orange-600',
        description: 'You are next in line. Please be positioned right near your counter.'
      };
    case 'CALLED':
      return {
        label: 'Token Called!',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-900',
        badgeBorder: 'border-emerald-300',
        iconColor: 'text-emerald-600',
        description: 'Your token is being served! Please step forward to your counter.'
      };
    case 'CONFIRMED':
      return {
        label: 'Present at Counter',
        badgeBg: 'bg-teal-50',
        badgeText: 'text-teal-800',
        badgeBorder: 'border-teal-200',
        iconColor: 'text-teal-600',
        description: 'Desk operator notified of your physical presence.'
      };
    case 'IN_SERVICE':
      return {
        label: 'Being Served',
        badgeBg: 'bg-indigo-50',
        badgeText: 'text-indigo-800',
        badgeBorder: 'border-indigo-200',
        iconColor: 'text-indigo-600',
        description: 'Currently at the counter undergoing service.'
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700',
        badgeBorder: 'border-slate-300',
        iconColor: 'text-slate-500',
        description: 'Service completed successfully. Thank you!'
      };
    case 'NO_SHOW':
      return {
        label: 'Missed Turn',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-800',
        badgeBorder: 'border-rose-300',
        iconColor: 'text-rose-600',
        description: 'Response window expired. Please rejoin or contact reception.'
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        badgeBg: 'bg-gray-100',
        badgeText: 'text-gray-700',
        badgeBorder: 'border-gray-300',
        iconColor: 'text-gray-500',
        description: 'Token was cancelled.'
      };
    default:
      return {
        label: status,
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700',
        badgeBorder: 'border-slate-200',
        iconColor: 'text-slate-500',
        description: ''
      };
  }
}
