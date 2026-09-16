import React from 'react';
import { Building2, MapPin, Users, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LocationCard({ hospital }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-sky-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shrink-0 mt-0.5">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-sky-700 transition">
              {hospital.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{hospital.address}</span>
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          PIN {hospital.pincode}
        </span>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 my-3.5 border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Users className="w-4 h-4 text-sky-600" />
          <span>Queue status: <strong className="text-slate-800 font-semibold">{hospital.totalWaiting} people waiting</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{hospital.operatingHours}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Available Services</p>
        <div className="flex flex-wrap gap-1.5">
          {hospital.services.map((service) => (
            <span
              key={service.id}
              className="inline-block px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-2xs"
            >
              {service.name}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {hospital.services.length} active service desks
        </span>
        <Link
          to={`/hospital/${hospital.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
        >
          View Services
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
