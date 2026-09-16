import React from 'react';
import { Sparkles, Clock, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RecommendationCard({ recommendation, onJoin }) {
  if (!recommendation) return null;

  return (
    <div className="bg-gradient-to-br from-sky-50/80 via-white to-sky-50/50 border border-sky-200/90 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-sky-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-600 text-white shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Assisted Counter Recommendation
        </span>
        <span className="text-xs text-slate-500 hidden sm:inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Queue Throughput Analysis
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider block mb-0.5">
            Best option for you
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            Counter {recommendation.counterNumber} — {recommendation.counterName}
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            {recommendation.reason || "Counter 2 is currently the fastest suitable option for this service."}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/90 border border-sky-100 p-3.5 rounded-xl shrink-0 shadow-2xs">
          <div className="border-r border-slate-100 pr-3">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Estimated Wait</span>
            <span className="text-lg font-black text-sky-700">~{recommendation.estimatedWaitMinutes} mins</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Backlog</span>
            <span className="text-sm font-bold text-slate-800">2 people</span>
          </div>
        </div>
      </div>

      {recommendation.comparisonNote && (
        <div className="text-xs text-slate-500 bg-sky-100/40 p-2.5 rounded-lg border border-sky-200/50 mb-4 leading-relaxed">
          <strong className="text-slate-700">Why not other counters?</strong> {recommendation.comparisonNote}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-sky-100">
        <span className="text-xs text-slate-500">
          Based on current queue movement and recent service times.
        </span>
        <button
          type="button"
          onClick={() => onJoin && onJoin(recommendation)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition cursor-pointer"
        >
          <span>Join Counter {recommendation.counterNumber}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
