import React, { useEffect, useRef } from 'react';
import { Bot, User, Hash, Info, CheckCheck } from 'lucide-react';

export default function ChatWindow({ messages = [], currentUsername, currentRoom, typingUsers = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Channel Header */}
      <div className="px-6 py-3.5 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-sm text-slate-100 font-mono">
            {currentRoom}
          </span>
          <span className="text-xs text-slate-400">• Persistent Bi-directional Stream</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          {messages.length} Events Logged
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-400 mb-3 border border-slate-700/50">
              <Hash className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">Channel #{currentRoom} is ready</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Send a payload across the WebSocket gateway to initialize bi-directional communication.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isSelf = msg.username === currentUsername;
            const isSystem = msg.type === 'system';

            if (isSystem) {
              return (
                <div key={msg.id || index} className="flex justify-center my-3 message-item">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
                    <Info className="w-3 h-3 text-cyan-400" />
                    <span>{msg.text}</span>
                    <span className="text-slate-600 text-[10px]">{msg.displayTime}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id || index}
                className={`flex gap-3 message-item ${isSelf ? 'justify-end' : 'justify-start'}`}
              >
                {/* Peer Avatar */}
                {!isSelf && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-300 shrink-0 mt-0.5">
                    {msg.username.substring(0, 2).toUpperCase()}
                  </div>
                )}

                {/* Bubble Container */}
                <div className={`max-w-[78%] sm:max-w-[65%] flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name & Time */}
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-medium text-slate-400">
                      {isSelf ? 'You' : msg.username}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {msg.displayTime}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isSelf
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-xs shadow-md shadow-indigo-600/20'
                        : 'bg-slate-800/90 text-slate-100 rounded-tl-xs border border-slate-700/60'
                    }`}
                  >
                    <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Ack status */}
                  {isSelf && (
                    <div className="flex items-center gap-1 mt-1 pr-1 text-[10px] text-indigo-400 font-mono">
                      <span>delivered</span>
                      <CheckCheck className="w-3 h-3 text-cyan-400" />
                    </div>
                  )}
                </div>

                {/* Self Avatar */}
                {isSelf && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-xs font-mono font-bold text-white shrink-0 mt-0.5 shadow-md shadow-indigo-600/30">
                    {currentUsername.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 w-fit text-xs text-cyan-300 font-mono">
            <span className="flex gap-1 py-1 px-1">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </span>
            <span>
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
