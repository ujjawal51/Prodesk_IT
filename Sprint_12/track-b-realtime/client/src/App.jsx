import React, { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import Navbar from './components/Navbar';
import RoomSelector from './components/RoomSelector';
import ActiveUsers from './components/ActiveUsers';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import PostmanGuide from './components/PostmanGuide';
import { Shield, Sparkles, AlertTriangle, Cpu, Terminal } from 'lucide-react';

export default function App() {
  const [showPostmanModal, setShowPostmanModal] = useState(false);

  const {
    isConnected,
    connectionTransport,
    latencyMs,
    username,
    currentRoom,
    messages,
    roomUsers,
    activeStats,
    typingUsers,
    systemAlert,
    switchRoom,
    sendMessage,
    startTyping,
    stopTyping,
    broadcastAlert
  } = useSocket();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        isConnected={isConnected}
        transport={connectionTransport}
        latencyMs={latencyMs}
        username={username}
        onOpenAudit={() => setShowPostmanModal(true)}
      />

      {/* Global Broadcast Alert Banner */}
      {systemAlert && (
        <div className="bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-cyan-500/20 border-b border-amber-500/40 px-6 py-2.5 flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 max-w-4xl">
            <span className="p-1 rounded bg-amber-500/30 text-amber-300">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-amber-200">{systemAlert.title}:</span>
            <span className="text-xs text-slate-200">{systemAlert.text}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {new Date(systemAlert.timestamp).toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Main Workspace Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        {/* Left Sidebar: Channels & Architecture Info */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4 min-h-0">
          <RoomSelector
            currentRoom={currentRoom}
            onSelectRoom={switchRoom}
            activeRooms={activeStats.rooms}
            stats={activeStats}
          />

          <ActiveUsers
            users={roomUsers}
            currentUsername={username}
            currentRoom={currentRoom}
            totalOnline={activeStats.totalOnline}
          />

          {/* Technical Info Card */}
          <div className="glass-panel rounded-2xl p-4 mt-auto text-xs text-slate-400 space-y-2 border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold font-mono text-[11px]">
              <Cpu className="w-3.5 h-3.5" />
              <span>STRICTMODE COMPLIANT</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              React 18 cleanup implemented: <code className="text-cyan-300 font-mono">return () =&gt; socket.disconnect()</code> prevents duplicate connections during development hot reloading.
            </p>
          </div>
        </aside>

        {/* Center: Live Chat Stream */}
        <main className="col-span-12 lg:col-span-9 flex flex-col glass-panel rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl min-h-0">
          <ChatWindow
            messages={messages}
            currentUsername={username}
            currentRoom={currentRoom}
            typingUsers={typingUsers}
          />

          <MessageInput
            onSendMessage={sendMessage}
            onStartTyping={startTyping}
            onStopTyping={stopTyping}
            onBroadcastAlert={broadcastAlert}
            disabled={!isConnected}
          />
        </main>
      </div>

      {/* Postman Modal Guide */}
      <PostmanGuide
        isOpen={showPostmanModal}
        onClose={() => setShowPostmanModal(false)}
      />
    </div>
  );
}
