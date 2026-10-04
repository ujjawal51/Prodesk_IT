import React from 'react';
import { Users, Circle, Radio } from 'lucide-react';

export default function ActiveUsers({ users = [], currentUsername, currentRoom, totalOnline }) {
  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Room Members
          </h3>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {users.length} In #{currentRoom}
        </span>
      </div>

      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
        {users.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No other members in this room yet.</p>
        ) : (
          users.map((user) => {
            const isSelf = user.username === currentUsername;
            return (
              <div
                key={user.socketId}
                className={`flex items-center justify-between p-2 rounded-xl border transition ${
                  isSelf
                    ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 p-0.5 object-cover"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-medium truncate flex items-center gap-1.5">
                      <span>{user.username}</span>
                      {isSelf && (
                        <span className="text-[9px] font-mono uppercase bg-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      ID: {user.socketId.substring(0, 6)}...
                    </p>
                  </div>
                </div>

                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>
            );
          })
        )}
      </div>

      {/* Global Server Metric */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono px-2">
        <span className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>Cluster Online:</span>
        </span>
        <span className="font-semibold text-cyan-300">{totalOnline} Node(s)</span>
      </div>
    </div>
  );
}
