import React from 'react';
import { Layers, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-700 text-white flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 font-display">DigitalQueue</span>
            <span>—</span>
            <span>Skip the physical wait. Arrive when your turn is near.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Fairness-Verified Token Engine
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              AI Counter Throughput
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
          <p>© 2026 DigitalQueue. College Hackathon MVP Project. All simulated hospital services are fictional.</p>
          <div className="flex items-center gap-3">
            <Link to="/search" className="hover:text-slate-600 transition">Services</Link>
            <Link to="/exchange" className="hover:text-slate-600 transition">Exchange Rules</Link>
            <Link to="/profile" className="hover:text-slate-600 transition">Demo Profile</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
