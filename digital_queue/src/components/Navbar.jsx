import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  Bell,
  User,
  ArrowLeftRight,
  Menu,
  X,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeToken,
    unreadNotifCount,
    isDemoAutoPlay,
    setIsDemoAutoPlay,
    advanceSimulationStep,
    resetSimulation
  } = useQueue();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Demo helper banner for hackathon judges & testers */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-bold text-sky-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Hackathon Live Queue Engine
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-400">
            Simulates dynamic hospital queue movement & turn approach
          </span>
        </div>

        {/* Demo Simulation Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={advanceSimulationStep}
            title="Advance Queue Movement (+1 token served)"
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-semibold border border-slate-700 cursor-pointer transition"
          >
            <FastForward className="w-3 h-3 text-sky-400" />
            <span>Next Step</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDemoAutoPlay(!isDemoAutoPlay)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition cursor-pointer ${
              isDemoAutoPlay
                ? 'bg-amber-900/40 text-amber-300 border-amber-600'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {isDemoAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{isDemoAutoPlay ? 'Auto-Advancing (7s)' : 'Auto-Play'}</span>
          </button>
          <button
            type="button"
            onClick={resetSimulation}
            title="Reset to Initial State (#42, 5 ahead, 18m)"
            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-[11px] border border-slate-700 cursor-pointer transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-sky-700 text-white flex items-center justify-center shadow-xs group-hover:bg-sky-800 transition">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight block leading-none font-display">
                DigitalQueue
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Smart Patient Queuing
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                isActive('/')
                  ? 'bg-sky-50 text-sky-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/search"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                isActive('/search')
                  ? 'bg-sky-50 text-sky-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Services</span>
            </Link>

            {activeToken && (
              <Link
                to="/active-queue"
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                  isActive('/active-queue')
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Active Token #{activeToken.tokenNumber}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </Link>
            )}

            <Link
              to="/exchange"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                isActive('/exchange')
                  ? 'bg-sky-50 text-sky-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Slot Exchange</span>
            </Link>

            <Link
              to="/notifications"
              className={`relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition ${
                isActive('/notifications') ? 'text-sky-700 bg-sky-50' : ''
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </Link>

            <Link
              to={user ? "/profile" : "/login"}
              className={`flex items-center gap-2 pl-3 ml-2 border-l border-slate-200 ${
                (isActive('/profile') || isActive('/login')) ? 'text-sky-700' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-bold">
                {user ? user.name.charAt(0) : 'U'}
              </div>
              <span className="text-xs font-semibold hidden lg:inline">
                {user ? user.name : 'Sign In'}
              </span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {activeToken && (
              <Link
                to="/active-queue"
                className="px-2.5 py-1 bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                #{activeToken.tokenNumber}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Find Services
          </Link>
          {activeToken && (
            <Link
              to="/active-queue"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold bg-sky-50 text-sky-800"
            >
              Active Token #{activeToken.tokenNumber} ({activeToken.estimatedWaitMinutes}m wait)
            </Link>
          )}
          <Link
            to="/exchange"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Slot Exchange
          </Link>
          <Link
            to="/notifications"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <span>Notifications</span>
            {unreadNotifCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                {unreadNotifCount}
              </span>
            )}
          </Link>
          <Link
            to={user ? "/profile" : "/login"}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {user ? `Profile (${user.name})` : 'Sign In'}
          </Link>
        </div>
      )}
    </header>
  );
}
