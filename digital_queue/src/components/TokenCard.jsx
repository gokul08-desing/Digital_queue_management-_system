import React from 'react';
import { Building2, Layers, MapPin, Sparkles } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function TokenCard({ token }) {
  if (!token) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 relative overflow-hidden">
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-sky-800 font-semibold mb-1">
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span>{token.hospitalName}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {token.serviceName}
          </h2>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{token.hospitalAddress}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={token.status} size="large" />
        </div>
      </div>

      {/* Main Token Display Hero */}
      <div className="py-6 text-center border-b border-slate-100 relative">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
          Your Digital Token
        </span>
        <div className="inline-block relative">
          <div className="text-6xl sm:text-7xl font-black text-slate-900 font-mono tracking-tight leading-none py-1">
            #{token.tokenNumber}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Assigned to <strong className="text-slate-700 font-semibold">{token.counterName || `Counter ${token.counterNumber}`}</strong>
        </p>
      </div>

      {/* Serving vs User Position Metrics */}
      <div className="grid grid-cols-2 gap-3 pt-5 text-center">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <span className="text-xs text-slate-500 block mb-0.5">Now Serving</span>
          <span className="text-2xl font-extrabold text-slate-800 font-mono">
            #{token.currentToken}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">At Desk</span>
        </div>

        <div className="bg-sky-50/60 rounded-xl p-3 border border-sky-100">
          <span className="text-xs text-sky-800 font-semibold block mb-0.5">People Ahead</span>
          <span className="text-2xl font-extrabold text-sky-700 font-mono">
            {token.peopleAhead}
          </span>
          <span className="text-[11px] text-sky-600/80 block mt-0.5">
            {token.peopleAhead === 0 ? 'Your turn!' : token.peopleAhead === 1 ? '1 person' : `${token.peopleAhead} people`}
          </span>
        </div>
      </div>
    </div>
  );
}
