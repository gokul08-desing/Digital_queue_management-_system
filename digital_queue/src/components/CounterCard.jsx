import React from 'react';
import { Users, Clock, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CounterCard({ counter, onSelect, isSelected = false }) {
  const isRec = counter.isRecommended;

  return (
    <div
      className={`relative bg-white rounded-xl border transition-all duration-200 p-5 ${
        isSelected
          ? 'border-sky-600 ring-2 ring-sky-500/20 shadow-md'
          : isRec
          ? 'border-sky-300 shadow-sm hover:border-sky-400'
          : 'border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      {isRec && (
        <div className="absolute -top-3 left-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-700 text-white shadow-xs">
          <Zap className="w-3 h-3 fill-white" />
          Recommended for you
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3 pt-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Counter {counter.counterNumber}
          </span>
          <h4 className="text-base font-bold text-slate-900">{counter.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{counter.staffName}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block">Serving Token</span>
          <span className="text-lg font-extrabold text-slate-800 font-mono">
            #{counter.currentToken}
          </span>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 text-xs">
        <div>
          <span className="text-slate-500 block flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" /> People Waiting
          </span>
          <span className="text-sm font-bold text-slate-800 mt-0.5 block">
            {counter.peopleWaiting} people
          </span>
        </div>
        <div>
          <span className="text-slate-500 block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Avg Service Rate
          </span>
          <span className="text-sm font-bold text-slate-800 mt-0.5 block">
            {counter.avgServiceTime} min / person
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div>
          <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Estimated Wait</span>
          <span className={`text-base font-extrabold ${isRec ? 'text-sky-700' : 'text-slate-800'}`}>
            ~{counter.estimatedWaitMinutes} mins
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelect && onSelect(counter)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            isRec
              ? 'bg-sky-700 hover:bg-sky-800 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          {isSelected ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              Selected
            </>
          ) : (
            <>
              Select Counter
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
