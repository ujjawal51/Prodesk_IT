import React, { useState } from 'react';
import { Send, Bell, Zap, CornerDownLeft } from 'lucide-react';

export default function MessageInput({
  onSendMessage,
  onStartTyping,
  onStopTyping,
  onBroadcastAlert,
  disabled
}) {
  const [inputText, setInputText] = useState('');

  const handleChange = (e) => {
    setInputText(e.target.value);
    if (e.target.value.trim().length > 0) {
      onStartTyping();
    } else {
      onStopTyping();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleQuickAlert = (globalScope) => {
    const alertText = prompt(
      globalScope
        ? 'Enter global cluster broadcast message (io.emit - sent to ALL nodes):'
        : 'Enter peer broadcast alert (socket.broadcast.emit - sent to peers ONLY):',
      'System maintenance: Redis cache cluster sync at 12:00 UTC.'
    );
    if (alertText && alertText.trim()) {
      onBroadcastAlert(alertText.trim(), globalScope);
    }
  };

  return (
    <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex flex-col gap-2">
      {/* Quick Action Badges */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
        <div className="flex items-center gap-2">
          <span>Quick Broadcast:</span>
          <button
            type="button"
            onClick={() => handleQuickAlert(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition"
            title="Demonstrates FAQ Q9: io.emit (global including sender)"
          >
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>io.emit (Global)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAlert(false)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition"
            title="Demonstrates FAQ Q9: socket.broadcast.emit (exclude sender)"
          >
            <Bell className="w-3 h-3 text-cyan-400" />
            <span>socket.broadcast (Peers)</span>
          </button>
        </div>

        <span className="hidden sm:inline text-slate-500 flex items-center gap-1">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 text-[10px]">Enter</kbd>
          <span>to send</span>
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? 'Connecting to WebSocket gateway...' : 'Type an event payload or chat message...'}
            className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition pr-10"
          />
          {inputText.trim() && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] font-mono">
              <CornerDownLeft className="w-3.5 h-3.5 text-indigo-400" />
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled || !inputText.trim()}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition transform active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Dispatch</span>
        </button>
      </form>
    </div>
  );
}
