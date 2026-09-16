import React from 'react';
import { ArrowRight, Clock, Users, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ service, hospitalId }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-sky-300 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100 mb-1.5 uppercase tracking-wider">
            {service.category}
          </span>
          <h4 className="text-base font-semibold text-slate-900">{service.name}</h4>
        </div>
        <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
          <Layers className="w-4 h-4" />
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-4">
        {service.description}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Users className="w-3.5 h-3.5 text-sky-600" />
          <span>Waiting: <strong>{service.totalWaiting}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span>Avg wait: ~<strong>{service.avgWaitMinutes}m</strong></span>
        </div>
      </div>

      <Link
        to={`/hospital/${hospitalId}/service/${service.id}`}
        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
      >
        <span>View Counters & Live Status</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
