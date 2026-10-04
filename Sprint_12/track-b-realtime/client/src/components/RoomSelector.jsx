import React from 'react';
import { Hash, Users, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

const roomMeta = {
  general: { label: 'general-engineering', icon: Hash, desc: 'Central workspace updates & discussions' },
  'dev-ops': { label: 'dev-ops-pipeline', icon: Cpu, desc: 'CI/CD, Kubernetes & container feeds' },
  'engineering-leads': { label: 'architectural-leads', icon: ShieldAlert, desc: 'Senior RFCs and design decisions' },
  random: { label: 'casual-lounge', icon: Sparkles, desc: 'Informal discussions & team banter' }
};

export default function RoomSelector({ currentRoom, onSelectRoom, activeRooms = [], stats }) {
  const roomsList = activeRooms.length > 0 ? activeRooms : ['general', 'dev-ops', 'engineering-leads', 'random'];

  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Communication Channels
        </h3>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
          {roomsList.length} Active
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {roomsList.map((roomKey) => {
          const isSelected = currentRoom.toLowerCase() === roomKey.toLowerCase();
          const meta = roomMeta[roomKey.toLowerCase()] || { label: roomKey, icon: Hash, desc: 'General channel' };
          const Icon = meta.icon;

          return (
            <button
              key={roomKey}
              onClick={() => onSelectRoom(roomKey)}
              className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600/30 to-indigo-500/10 border border-indigo-500/40 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400'}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold truncate">
                    #{meta.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {meta.desc}
                  </div>
                </div>
              </div>

              {isSelected && (
                <span className="shrink-0 flex h-2 w-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
