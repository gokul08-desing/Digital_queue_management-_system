import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import CounterCard from '../components/CounterCard';
import RecommendationCard from '../components/RecommendationCard';
import LoadingState from '../components/LoadingState';
import { api } from '../services/api';

export default function ServiceDetailsPage() {
  const { hospitalId, serviceId } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [counters, setCounters] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const hosp = await api.getLocation(hospitalId || 'hospital_001');
        setHospital(hosp);

        const currentService = serviceId
          ? hosp.services.find((s) => s.id === serviceId) || hosp.services[0]
          : hosp.services[0];
        setSelectedService(currentService);

        const cntrs = await api.getCounters(currentService.id);
        setCounters(cntrs);

        const rec = await api.getCounterRecommendation(currentService.id);
        setRecommendation(rec);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [hospitalId, serviceId]);

  const handleSelectCounter = (counter) => {
    navigate('/join-confirm', {
      state: {
        hospital,
        service: selectedService,
        counter
      }
    });
  };

  const handleJoinRecommendation = (rec) => {
    const targetCounter = counters.find((c) => c.counterNumber === rec.counterNumber) || counters[1];
    handleSelectCounter(targetCounter);
  };

  if (loading || !hospital || !selectedService) {
    return <LoadingState message="Loading hospital counters and live traffic..." fullPage />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/search" className="hover:text-slate-800">Locations</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">{hospital.name}</span>
      </nav>

      {/* Hospital Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                  {hospital.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  PIN {hospital.pincode}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{hospital.address}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 shrink-0">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase">Hours</span>
              <span className="font-semibold text-slate-800">{hospital.operatingHours}</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-slate-400 block text-[11px] uppercase">Phone</span>
              <span className="font-semibold text-slate-800">{hospital.phone}</span>
            </div>
          </div>
        </div>

        {/* Service Switcher Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
            Select Service Line
          </span>
          <div className="flex flex-wrap gap-2">
            {hospital.services.map((svc) => {
              const isCurrent = svc.id === selectedService.id;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => {
                    navigate(`/hospital/${hospital.id}/service/${svc.id}`);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                    isCurrent
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{svc.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    isCurrent ? 'bg-sky-800 text-sky-200' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {svc.counters.length} counters
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Recommendation Section */}
      {recommendation && (
        <RecommendationCard
          recommendation={recommendation}
          onJoin={handleJoinRecommendation}
        />
      )}

      {/* Active Service Counters Breakdown */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Available Counters for {selectedService.name}
            </h2>
            <p className="text-xs text-slate-500">
              Select your preferred counter or choose our velocity-optimized recommendation.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            {counters.length} Live Desks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {counters.map((counter) => (
            <CounterCard
              key={counter.id}
              counter={counter}
              onSelect={handleSelectCounter}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
