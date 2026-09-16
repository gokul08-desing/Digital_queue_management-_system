import React from 'react';
import { Navigation, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ArrivalWindow({
  arrivalStart = '10:38 AM',
  arrivalEnd = '10:43 AM',
  status = 'WAITING'
}) {
  const isUrgent = status === 'COME_NOW' || status === 'CALLED';
  const isApproaching = status === 'APPROACHING';

  return (
    <div className={`rounded-2xl border p-5 shadow-xs transition-all ${
      isUrgent
        ? 'bg-rose-50/70 border-rose-200 text-rose-950'
        : isApproaching
        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-80">
          <Navigation className="w-4 h-4 text-sky-600" />
          Recommended Arrival Window
        </span>
      </div>

      <div className="my-2">
        {isUrgent ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-700">
              Please Arrive Now
            </span>
          </div>
        ) : (
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
            {arrivalStart} — {arrivalEnd}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100 flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
        <span>
          Plan to be inside the waiting lounge 5 minutes before your window. No need to stand in physical lines.
        </span>
      </p>
    </div>
  );
}
