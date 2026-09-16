import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  ArrowLeftRight,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Navigation,
  Sparkles,
  RefreshCw,
  XCircle,
  HelpCircle,
  Volume2,
  ExternalLink
} from 'lucide-react';
import TokenCard from '../components/TokenCard';
import ETACard from '../components/ETACard';
import ArrivalWindow from '../components/ArrivalWindow';
import QueueProgress from '../components/QueueProgress';
import ConfirmationModal from '../components/ConfirmationModal';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { useQueue } from '../context/QueueContext';
import { useQueueStatus } from '../hooks/useQueueStatus';

export default function ActiveQueuePage() {
  const navigate = useNavigate();
  const {
    activeToken,
    releaseCurrentSlot,
    confirmArrival,
    markNoShow,
    completeService,
    cancelToken,
    advanceSimulationStep,
    resetSimulation
  } = useQueue();

  // Polling hook (polls every 5s as mandated by specification)
  const { queueData, loading, lastPolledAt } = useQueueStatus(activeToken?.id || 'queue_opd_001', 5000);

  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [responseNotice, setResponseNotice] = useState(null);

  // Use live polled data or activeToken from context
  const token = queueData || activeToken;

  if (!token) {
    return (
      <div className="py-12">
        <EmptyState
          title="No Active Queue Token"
          description="You are currently not in any service queue. Browse locations to obtain a digital token."
          actionLabel="Find Service & Join"
          onAction={() => navigate('/search?q=600040')}
        />
      </div>
    );
  }

  const isCalled = token.status === 'CALLED';
  const isApproaching = token.status === 'APPROACHING';
  const isComeNow = token.status === 'COME_NOW';
  const isConfirmed = token.status === 'CONFIRMED';
  const isNoShow = token.status === 'NO_SHOW';
  const isCompleted = token.status === 'COMPLETED';

  const handleConfirmArrival = () => {
    confirmArrival();
    setResponseNotice('Checked in! Desk operator has been notified that you are at Counter 2.');
  };

  const handleCantAttend = () => {
    // If user cannot attend, offer releasing slot for swap immediately
    navigate('/exchange');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Turn Approaching / Called Alert Banners */}
      {isCalled && (
        <div className="bg-emerald-600 text-white rounded-2xl p-5 shadow-lg animate-bounce-subtle border-2 border-emerald-400">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-emerald-700 flex items-center justify-center shrink-0">
                <Volume2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">Your turn is now!</h3>
                <p className="text-sm text-emerald-100 mt-0.5">
                  Token <strong>#{token.tokenNumber}</strong> has been called. Please step forward to <strong>{token.counterName}</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-emerald-500/80 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleConfirmArrival}
              className="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-bold shadow-md cursor-pointer transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>I'm coming (At Counter)</span>
            </button>
            <button
              type="button"
              onClick={handleCantAttend}
              className="px-4 py-2 bg-emerald-700/70 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition"
            >
              I can't attend (Release / Swap Slot)
            </button>
          </div>
        </div>
      )}

      {isApproaching && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4.5 flex items-center gap-3 text-amber-900 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 animate-wiggle" />
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-amber-950">Your turn is approaching</h4>
            <p className="mt-0.5 text-amber-800">
              Only {token.peopleAhead} people ahead. Please start moving towards {token.counterName}.
            </p>
          </div>
        </div>
      )}

      {isComeNow && (
        <div className="bg-orange-50 border border-orange-300 rounded-2xl p-4.5 flex items-center gap-3 text-orange-900 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-orange-950">Please arrive now</h4>
            <p className="mt-0.5 text-orange-800">
              You are next in line! Position yourself directly in front of {token.counterName}.
            </p>
          </div>
        </div>
      )}

      {isNoShow && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-5 text-rose-900 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold">You missed your turn (No-Show)</h3>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                Your response window expired after Token #{token.tokenNumber} was called.
                In accordance with fairness rules, subsequent tokens have been summoned.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetSimulation}
                  className="px-3.5 py-1.5 bg-rose-700 text-white rounded-lg text-xs font-semibold hover:bg-rose-800 transition cursor-pointer"
                >
                  Rejoin Queue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {responseNotice && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 text-xs p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{responseNotice}</span>
        </div>
      )}

      {/* Main Token Card */}
      <TokenCard token={token} />

      {/* ETA and Arrival Window Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ETACard
          estimatedWaitMinutes={token.estimatedWaitMinutes}
          lastUpdated={lastPolledAt ? lastPolledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now'}
        />
        <ArrivalWindow
          arrivalStart={token.recommendedArrivalStart}
          arrivalEnd={token.recommendedArrivalEnd}
          status={token.status}
        />
      </div>

      {/* Visual Queue Progress */}
      <QueueProgress
        currentToken={token.currentToken}
        userToken={token.tokenNumber}
        peopleAhead={token.peopleAhead}
      />

      {/* Smart Slot Exchange Action Card */}
      {!isCalled && !isNoShow && !isCompleted && (
        <div className="bg-gradient-to-r from-sky-50 via-teal-50/50 to-white border border-sky-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
              <ArrowLeftRight className="w-4 h-4 text-teal-600" />
              <span>Can't make your scheduled time?</span>
            </div>
            <p className="text-xs text-slate-600 max-w-md">
              Don't lose your spot or get marked as a no-show. Offer your slot to eligible waiting peers or browse available swaps.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {token.isSlotReleased ? (
              <Link
                to="/exchange"
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Slot On Market (View Swaps)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setShowReleaseModal(true)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Release Slot for Exchange
              </button>
            )}
          </div>
        </div>
      )}

      {/* Secondary Actions & Polling Indicator */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Polling backend every 5 seconds</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
          >
            Leave / Cancel Token
          </button>
        </div>
      </div>

      {/* Release Slot Confirmation Modal */}
      <ConfirmationModal
        isOpen={showReleaseModal}
        title="Release Slot for Fair Exchange"
        message={
          <div>
            <p className="mb-2">
              Your current queue slot (<strong>Token #{token.tokenNumber}</strong>) will be made available to other eligible users waiting in the same <strong>{token.serviceName}</strong> queue.
            </p>
            <p className="text-xs text-slate-500">
              If another user confirms the swap, your queue position will be safely exchanged according to platform fairness rules.
            </p>
          </div>
        }
        confirmLabel="Release Slot"
        cancelLabel="Keep My Slot"
        onConfirm={async () => {
          await releaseCurrentSlot();
          navigate('/exchange');
        }}
        onClose={() => setShowReleaseModal(false)}
      />

      {/* Cancel Token Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        title="Cancel Digital Queue Token"
        message="Are you sure you want to cancel your token? You will lose your spot in line and will need to register again."
        confirmLabel="Yes, Cancel Token"
        cancelLabel="Keep Token"
        isDestructive={true}
        onConfirm={() => {
          cancelToken();
          navigate('/');
        }}
        onClose={() => setShowCancelModal(false)}
      />
    </div>
  );
}
