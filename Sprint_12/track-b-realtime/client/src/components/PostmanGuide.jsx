import React from 'react';
import { X, Terminal, CheckCircle2, Copy, ExternalLink, HelpCircle } from 'lucide-react';

export default function PostmanGuide({ isOpen, onClose }) {
  if (!isOpen) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    alert('Copied to clipboard: ' + text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 p-6 flex flex-col gap-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Postman WebSocket Audit Guide (FAQ Q10)
              </h3>
              <p className="text-xs text-slate-400">Verifying live bidirectional endpoints without browser UI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-4 text-xs text-slate-300">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="font-semibold text-amber-400 block mb-1 text-sm font-mono">
              Step 1: Open New WebSocket Request in Postman
            </span>
            <p className="text-slate-400 leading-relaxed">
              In Postman (v8.5+), click <strong>New</strong> ➔ Select <strong>WebSocket Request</strong>. Choose <strong>Socket.IO</strong> or raw <strong>WebSocket</strong>.
            </p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-1 text-sm font-mono">
              Step 2: WebSocket Connection URI
            </span>
            <div className="flex items-center justify-between gap-2 mt-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 font-mono text-xs text-indigo-300">
              <span className="truncate">ws://localhost:5000/socket.io/?EIO=4&transport=websocket</span>
              <button
                onClick={() => copyToClipboard('ws://localhost:5000/socket.io/?EIO=4&transport=websocket')}
                className="hover:text-white text-slate-400 p-1"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="font-semibold text-emerald-400 block mb-1 text-sm font-mono">
              Step 3: Socket.IO Protocol Frame Simulation
            </span>
            <p className="text-slate-400 mb-2">
              If connecting via Raw WebSocket, Socket.IO Engine.IO v4 uses the packet format:
            </p>
            <div className="space-y-2">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
                <span className="text-slate-500">// 1. Handshake Packet (Send first):</span>
                <div className="text-emerald-400 font-bold">40</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
                <span className="text-slate-500">// 2. Send Message Event:</span>
                <div className="text-indigo-300">
                  42["send_message", &#123;"text": "Auditing from Postman CLI", "room": "general"&#125;]
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400" />
            <p className="text-[11px] leading-relaxed">
              <strong>Audit Verified:</strong> Postman will receive incoming broadcast payloads in the real-time response stream in sub-millisecond intervals.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
          >
            Dismiss Guide
          </button>
        </div>
      </div>
    </div>
  );
}
