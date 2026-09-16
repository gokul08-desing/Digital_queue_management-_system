import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Clock,
  History,
  CheckCircle2,
  LogOut,
  Bell,
  Globe,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import StatusBadge from '../components/StatusBadge';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { activeToken } = useQueue();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const demoUser = user;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center text-2xl font-black shrink-0 font-display">
              {demoUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 font-display">
                  {demoUser.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Patient
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{demoUser.phone}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer self-start sm:self-center"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Active Queue Card in Profile */}
      {activeToken && (
        <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block mb-2">
            Active Queue Token
          </span>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900 font-mono">
                  Token #{activeToken.tokenNumber}
                </span>
                <StatusBadge status={activeToken.status} />
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {activeToken.hospitalName} • {activeToken.serviceName} ({activeToken.counterName})
              </p>
            </div>

            <Link
              to="/active-queue"
              className="px-3.5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
            >
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Queue History */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-sky-700" />
          <h2 className="text-sm font-bold text-slate-900">Recent Queue History</h2>
        </div>

        <div className="space-y-3">
          {activeToken?.history?.map((hist) => (
            <div
              key={hist.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
            >
              <div>
                <div className="font-bold text-slate-800">
                  {hist.hospitalName} — {hist.serviceName}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Token #{hist.tokenNumber} • {hist.counter} • {hist.date}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                <CheckCircle2 className="w-3 h-3" />
                {hist.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Notification Preferences</h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Bell className="w-4 h-4 text-sky-600" />
              <span>In-App Turn Approaching Warnings</span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-sky-600 rounded cursor-pointer" />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Phone className="w-4 h-4 text-sky-600" />
              <span>SMS Arrival Notifications</span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-sky-600 rounded cursor-pointer" />
          </label>
        </div>
      </div>
    </div>
  );
}
