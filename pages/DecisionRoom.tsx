
import React, { useState } from 'react';
import { getDecisionSupport } from '../services/geminiService';
import { Message } from '../types';

const DecisionRoom: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<Message[]>([
    { role: 'assistant', content: 'Good evening. I am SENTINEL. How can I assist with your partner strategy today?', timestamp: new Date() }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    setChat(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const response = await getDecisionSupport(input);
    const aiMessage: Message = { role: 'assistant', content: response || '', timestamp: new Date() };
    setChat(prev => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-4xl font-light serif text-white mb-2">Decision Room</h2>
        <p className="text-slate-400">Strategic council for high-level partner operations.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[600px]">
        {/* Chat Area */}
        <div className="lg:col-span-3 glass-panel rounded-3xl flex flex-col overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-20"></div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                  ? 'bg-slate-200 text-black rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] opacity-50 mt-2 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none animate-pulse">
                  <div className="flex space-x-2">
                    <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 bg-white/5 border-t border-white/10">
            <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-2">
              <input 
                type="text"
                placeholder="Seek tactical advice or analysis..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder-slate-600 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button 
                type="submit"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all text-slate-300"
                disabled={loading}
              >
                <i className="fas fa-arrow-up"></i>
              </button>
            </div>
          </form>
        </div>

        {/* Tactical Info Panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Mascot Profile</h4>
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 glow-soft">
                  <i className="fas fa-dove text-4xl text-slate-400"></i>
               </div>
               <div>
                  <h5 className="text-white font-medium">SENTINEL-OWL</h5>
                  <p className="text-xs text-slate-500 italic">"Vision through the dusk."</p>
               </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Context Awareness</h4>
            <div className="space-y-4">
               <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-slate-500 mb-1">Market Volatility</div>
                  <div className="text-sm text-emerald-500">Stable</div>
               </div>
               <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-slate-500 mb-1">Network Trust Score</div>
                  <div className="text-sm text-white">8.4 / 10</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionRoom;
