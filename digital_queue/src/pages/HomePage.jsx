import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Navigation,
  Building2,
  AlertCircle
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import LocationCard from '../components/LocationCard';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { useQueue } from '../context/QueueContext';
import { api } from '../services/api';

export default function HomePage() {
  const { activeToken } = useQueue();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadHospitals() {
      setLoading(true);
      setError(null);
      try {
        const list = await api.searchLocations();
        if (isMounted) {
          setHospitals(list);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load service locations from backend.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadHospitals();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (query) => {
    if (query && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-10 shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20 mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Real-Time Fair Queue Routing & Smart Transit</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white leading-tight">
            You don't have to stand in the queue.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Join digitally, know your live position, receive a dynamic ETA, and arrive comfortably when your turn is approaching.
          </p>

          {/* Quick Search */}
          <div className="mt-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Your Active Queue Section (If active token exists in PostgreSQL) */}
      {activeToken ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse" />
              Your Active Queue
            </h2>
            <Link
              to="/active-queue"
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              Full Live Screen
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border-2 border-sky-100 rounded-2xl p-6 shadow-sm hover:border-sky-300 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Column: Hospital & Service */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                    {activeToken.hospitalName}
                  </span>
                  <StatusBadge status={activeToken.status} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {activeToken.serviceName}
                </h3>
                <p className="text-xs text-slate-500">
                  Counter: <strong className="text-slate-700 font-semibold">{activeToken.counterName}</strong>
                </p>
              </div>

              {/* Middle Column: Big Token & Position */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Your Token</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                    #{activeToken.tokenNumber}
                  </span>
                </div>
                <div className="border-x border-slate-200 px-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">People Ahead</span>
                  <span className="text-2xl sm:text-3xl font-black text-sky-700 font-mono">
                    {activeToken.peopleAhead}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ETA</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-800">
                    {activeToken.estimatedWaitMinutes}m
                  </span>
                </div>
              </div>

              {/* Right Column: Arrival Window & CTA */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                <div className="text-left lg:text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Recommended Arrival
                  </span>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {activeToken.recommendedArrivalStart} - {activeToken.recommendedArrivalEnd}
                  </span>
                </div>

                <Link
                  to="/active-queue"
                  className="w-full sm:w-auto px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>View Live Queue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center">
          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Active Queue Token</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Search for a service location below to join an outpatient registration or pharmacy line.
          </p>
          <Link
            to="/search?q=600040"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-700 text-white rounded-lg text-xs font-semibold hover:bg-sky-800"
          >
            Find Nearby Service
          </Link>
        </section>
      )}

      {/* Value Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-2.5">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">AI Counter Balancing</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Recommends counters based on real service velocity, not just line length.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-2.5">
            <Navigation className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">Dynamic Arrival Windows</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Calculates exact departure windows so you arrive just as your token approaches.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">Fair Peer Slot Exchange</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Cannot make your scheduled window? Offer your slot to eligible peers waiting in line.
          </p>
        </div>
      </section>

      {/* Nearby / Popular Services from Database */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Nearby / Popular Service Locations</h2>
            <p className="text-xs text-slate-500">Verified hospitals, clinics, and dispensaries in Tamil Nadu</p>
          </div>
          <Link
            to="/search"
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
          >
            View All ({hospitals.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Loading verified service facilities..." />
        ) : error ? (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hospitals.map((hospital) => (
              <LocationCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
