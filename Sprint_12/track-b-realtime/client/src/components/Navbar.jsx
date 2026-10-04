import React from 'react';
import { Radio, Wifi, WifiOff, Activity, ShieldCheck, Terminal, HelpCircle } from 'lucide-react';

export default function Navbar({ isConnected, transport, latencyMs, username, onOpenAudit }) {
  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-slate-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-lg font-['Outfit']">
                PULSE<span className="text-indigo-400">NET</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Track B Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-400">Enterprise Bi-directional WebSocket Pipeline</p>
          </div>
        </div>

        {/* Telemetry & Connection Status */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Postman Audit Button */}
          <button
            onClick={onOpenAudit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:text-white transition"
            title="Inspect Postman WebSocket Audit Guide"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Postman Audit</span>
          </button>

          {/* Latency Telemetry */}
          {isConnected && latencyMs !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">RTT:</span>
              <span className={`font-semibold ${latencyMs < 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {latencyMs}ms
              </span>
            </div>
          )}

          {/* Transport Mode Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Transport:</span>
            <span className="text-indigo-300 uppercase font-semibold">
              {transport}
            </span>
          </div>

          {/* Connection Status Pill */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 glow-emerald'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            <span className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
            </span>
            <span>{isConnected ? 'Gateway Connected' : 'Disconnected'}</span>
          </div>

          {/* Active Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="h-8 w-8 rounded-lg bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-xs font-mono font-bold text-indigo-200">
              {username.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-slate-200">{username}</p>
              <p className="text-[10px] text-slate-400">Fullstack Intern</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
