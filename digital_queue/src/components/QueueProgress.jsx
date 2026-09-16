import React from 'react';
import { User, Check, ArrowRight } from 'lucide-react';

export default function QueueProgress({ currentToken = 36, userToken = 42, peopleAhead = 5 }) {
  // Generate representation of queue tokens
  const totalTokens = Math.max(1, userToken - currentToken);
  const progressPercent = Math.min(100, Math.max(0, Math.round(((totalTokens - peopleAhead) / totalTokens) * 100)));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Live Queue Progression
        </span>
        <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
          {peopleAhead === 0 ? "You're next!" : `${peopleAhead} in queue ahead`}
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-3">
        <div
          className="bg-gradient-to-r from-sky-600 to-teal-500 h-full rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Landmarks */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Serving Desk: <strong className="text-slate-800 font-mono">#{currentToken}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 text-sky-800 font-medium">
          <span>Your Token: <strong className="text-slate-900 font-mono">#{userToken}</strong></span>
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 ring-2 ring-sky-200 animate-ping" />
        </div>
      </div>
    </div>
  );
}
