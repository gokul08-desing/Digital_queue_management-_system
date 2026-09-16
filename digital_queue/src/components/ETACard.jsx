import React from 'react';
import { Clock, TrendingDown, RefreshCw } from 'lucide-react';

export default function ETACard({ estimatedWaitMinutes, lastUpdated }) {
  const isUrgent = estimatedWaitMinutes <= 3;
  const isApproaching = estimatedWaitMinutes > 3 && estimatedWaitMinutes <= 8;

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 shadow-xs ${
      isUrgent
        ? 'bg-orange-50/70 border-orange-200'
        : isApproaching
        ? 'bg-amber-50/70 border-amber-200'
        : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-orange-600' : isApproaching ? 'text-amber-600' : 'text-sky-600'}`} />
          Dynamically Updated ETA
        </span>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <RefreshCw className="w-3 h-3 text-slate-300 animate-spin" />
          Live Polling
        </span>
      </div>

      <div className="flex items-baseline gap-2 my-2">
        {estimatedWaitMinutes === 0 ? (
          <span className="text-3xl sm:text-4xl font-black text-emerald-700">
            It's your turn now!
          </span>
        ) : (
          <>
            <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight transition-all duration-300 ${
              isUrgent ? 'text-orange-700' : isApproaching ? 'text-amber-700' : 'text-slate-900'
            }`}>
              {estimatedWaitMinutes}
            </span>
            <span className="text-sm font-semibold text-slate-500">minutes</span>
          </>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1 text-slate-600">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          Paced by recent desk completions
        </span>
        {lastUpdated && (
          <span className="text-[11px] text-slate-400">
            Updated {lastUpdated}
          </span>
        )}
      </div>
    </div>
  );
}
