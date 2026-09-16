import React from 'react';
import { ArrowLeftRight, Clock, ShieldCheck, UserCheck, ArrowUpRight } from 'lucide-react';

export default function SwapCard({ swap, onAccept, loading = false }) {
  const isEarlier = swap.timeAdvantageMinutes > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-sky-300 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-700">
                Offered by {swap.offeredBy.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({swap.offeredBy.maskedPhone})
              </span>
            </div>
            <p className="text-xs text-slate-500">{swap.serviceName} • {swap.counterName}</p>
          </div>
        </div>

        {isEarlier ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Clock className="w-3 h-3" />
            {swap.timeAdvantageMinutes}m Earlier
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Later Slot
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-lg p-3 border border-slate-100 mb-3.5 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Offered Token</span>
          <span className="text-lg font-black text-slate-900 font-mono">
            #{swap.offeredToken}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Target Arrival</span>
          <span className="text-sm font-bold text-slate-800">
            {swap.offeredArrivalTime}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-4 leading-relaxed flex items-start gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
        <span>{swap.eligibilityReason}</span>
      </p>

      <button
        type="button"
        disabled={loading}
        onClick={() => onAccept && onAccept(swap.id)}
        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
      >
        <span>Accept Slot Exchange</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
