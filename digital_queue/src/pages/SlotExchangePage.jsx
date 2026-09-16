import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import SwapCard from '../components/SwapCard';
import ConfirmationModal from '../components/ConfirmationModal';
import { useQueue } from '../context/QueueContext';

export default function SlotExchangePage() {
  const navigate = useNavigate();
  const {
    activeToken,
    availableSwaps,
    acceptSwap,
    releaseCurrentSlot
  } = useQueue();

  const [selectedSwapId, setSelectedSwapId] = useState(null);
  const [swapping, setSwapping] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const selectedSwap = availableSwaps.find((s) => s.id === selectedSwapId);

  const handleConfirmSwap = async () => {
    if (!selectedSwapId) return;
    setSwapping(true);
    try {
      const res = await acceptSwap(selectedSwapId);
      setSuccessMessage(`Slot exchange completed! You now hold Token #${res.updatedToken.tokenNumber} with ETA ~${res.updatedToken.estimatedWaitMinutes} minutes.`);
      setTimeout(() => {
        navigate('/active-queue');
      }, 1400);
    } finally {
      setSwapping(false);
      setSelectedSwapId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Controlled Peer Slot Exchange
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
          Smart Queue Slot Exchange
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Swap queue slots with eligible peers in your service line without losing position or dropping out.
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="font-semibold">{successMessage}</div>
        </div>
      )}

      {/* User's Current Queue Slot Summary */}
      {activeToken ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Your Current Assigned Slot
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  Token #{activeToken.tokenNumber}
                </span>
                <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                  {activeToken.serviceName} • {activeToken.counterName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Arrival window: <strong className="text-slate-700">{activeToken.recommendedArrivalStart} — {activeToken.recommendedArrivalEnd}</strong> (ETA ~{activeToken.estimatedWaitMinutes}m)
              </p>
            </div>

            <div className="shrink-0">
              {activeToken.isSlotReleased ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Your slot is listed for swap
                </span>
              ) : (
                <button
                  type="button"
                  onClick={releaseCurrentSlot}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  Release My Slot for Swap
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>You need an active queue token to participate in slot exchanges.</span>
        </div>
      )}

      {/* Available Exchange Opportunities */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Eligible Exchange Opportunities
            </h2>
            <p className="text-xs text-slate-500">
              Tokens in the same service line eligible under queue fairness algorithms
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {availableSwaps.length} available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableSwaps.map((swap) => (
            <SwapCard
              key={swap.id}
              swap={swap}
              onAccept={(id) => setSelectedSwapId(id)}
              loading={swapping}
            />
          ))}
        </div>
      </section>

      {/* Swap Fairness Rules Information Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sky-700" />
          <h3 className="text-sm font-bold text-slate-900">Swap Eligibility & Fairness Protocol</h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          DigitalQueue enforces strict anti-scalping fairness rules. A user can only exchange when:
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-1">
          <li className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
            <span>Both users must be in the exact same service queue.</span>
          </li>
          <li className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
            <span>Both tokens must still be in a valid waiting status.</span>
          </li>
          <li className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
            <span>Neither token is currently being called or in service.</span>
          </li>
          <li className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
            <span>Exchange is strictly peer-to-peer with zero commercial bidding.</span>
          </li>
        </ul>

        <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Queue hopping and commercial resale are prohibited by cryptographic token validation.</span>
        </div>
      </section>

      {/* Confirmation Modal for Swap */}
      {selectedSwap && (
        <ConfirmationModal
          isOpen={!!selectedSwapId}
          title="Confirm Slot Exchange"
          message={
            <div>
              <p className="mb-2">
                You are exchanging your <strong>Token #{activeToken?.tokenNumber}</strong> for <strong>Token #{selectedSwap.offeredToken}</strong> offered by <strong>{selectedSwap.offeredBy.name}</strong>.
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1 mb-2">
                <div>New Target Arrival: <strong className="text-slate-800">{selectedSwap.offeredArrivalTime}</strong></div>
                <div>New Estimated Wait: <strong className="text-slate-800">~{selectedSwap.offeredEtaMinutes} minutes</strong></div>
              </div>
              <p className="text-[11px] text-slate-500">
                This change takes effect immediately across both devices and hospital counters.
              </p>
            </div>
          }
          confirmLabel="Accept & Update My Token"
          cancelLabel="Cancel"
          onConfirm={handleConfirmSwap}
          onClose={() => setSelectedSwapId(null)}
        />
      )}
    </div>
  );
}
