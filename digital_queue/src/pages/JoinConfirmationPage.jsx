import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Layers,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { getStoredJwt } from '../services/api';

export default function JoinConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { joinQueue, loading } = useQueue();
  const { user, loginAsDemo } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(null);

  const state = location.state || {};
  const hospital = state.hospital || {
    id: "hospital_001",
    name: "ABC Multispeciality Hospital",
    address: "124 Anna Salai, Anna Nagar, Chennai - 600040"
  };
  const service = state.service || {
    id: "svc_opd_001",
    name: "General OPD"
  };
  const counter = state.counter || {
    id: "counter_2",
    counterNumber: 2,
    name: "Counter 2 (Dr. Priya)",
    estimatedWaitMinutes: 24,
    peopleWaiting: 5
  };

  const handleConfirm = async () => {
    setError(null);
    try {
      // Ensure user has an active authenticated session
      if (!user || !getStoredJwt()) {
        await loginAsDemo();
      }
      await joinQueue({
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        hospitalAddress: hospital.address,
        serviceId: service.id,
        serviceName: service.name,
        counterId: counter.id,
        counterNumber: counter.counterNumber,
        counterName: counter.name
      });
      setConfirmed(true);
      setTimeout(() => {
        navigate('/active-queue');
      }, 900);
    } catch (err) {
      console.error('Join queue error:', err);
      setError(err.message || 'Failed to join queue. Please check connection and try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6">
      <Link
        to={`/hospital/${hospital.id}/service/${service.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Change Counter Selection
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="text-center pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            Confirm Queue Entry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your digital token reservation details before joining.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Selected Summary Card */}
        <div className="my-6 space-y-3.5">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-500">Service Facility</span>
              <span className="text-xs font-bold text-slate-900 text-right">{hospital.name}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-500">Service Type</span>
              <span className="text-xs font-bold text-slate-900 text-right">{service.name}</span>
            </div>
            <div className="flex items-start justify-between border-t border-slate-200/60 pt-2.5">
              <span className="text-xs font-semibold text-slate-500">Selected Counter</span>
              <span className="text-xs font-black text-sky-800 text-right">
                {counter.counterNumber ? `Counter ${counter.counterNumber} — ` : ''}{counter.name}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-sky-50/60 rounded-xl p-3.5 border border-sky-100 text-center">
              <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider block">
                Estimated Wait
              </span>
              <span className="text-2xl font-black text-sky-700 font-mono mt-0.5 block">
                ~{counter.estimatedWaitMinutes} mins
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                People Ahead
              </span>
              <span className="text-2xl font-black text-slate-800 font-mono mt-0.5 block">
                {counter.peopleWaiting !== undefined ? counter.peopleWaiting : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Patient Name verification */}
        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-6 flex items-center justify-between">
          <span>Token registered to: <strong className="text-slate-800">{user ? user.name : 'Ananya Sharma'}</strong></span>
          <span className="text-slate-400 font-mono">{user ? user.phone : '9876543210'}</span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={loading || confirmed}
          onClick={handleConfirm}
          className="w-full py-3.5 bg-sky-700 hover:bg-sky-800 disabled:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-xs hover:shadow transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {confirmed ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>You're in the queue! Loading your assigned token...</span>
            </>
          ) : loading ? (
            <span>Generating Digital Token...</span>
          ) : (
            <>
              <span>Confirm & Get Token</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 text-center mt-4">
          By joining, you agree to respond when your token is called or release your slot for peer exchange.
        </p>
      </div>
    </div>
  );
}
