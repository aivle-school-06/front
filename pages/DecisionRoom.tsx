
import React, { useState } from 'react';

interface Notice {
  id: number;
  title: string;
  category: 'Urgent' | 'Update' | 'Advisory';
  date: string;
  excerpt: string;
  content: string;
  author: string;
}

const NOTICES: Notice[] = [
  { 
    id: 1, 
    title: 'Revised Logistics Compliance Framework', 
    category: 'Urgent', 
    date: '2025-05-12', 
    author: 'Compliance Dept.',
    excerpt: 'All tier-1 partners must update their security protocols by the end of Q2.',
    content: 'Following the recent network audit, we are implementing a revised Logistics Compliance Framework. This update focuses on end-to-end encryption for tier-1 partner communications and mandatory multi-factor authentication for all gateway access. Failure to comply by June 30th, 2025, will result in temporary suspension of API bridge privileges. Detailed technical specifications are available in the secure documentation vault.'
  },
  { 
    id: 2, 
    title: 'Network Expansion: SEA Corridors', 
    category: 'Update', 
    date: '2025-05-10', 
    author: 'Infrastructure Node',
    excerpt: 'New integration points established in Singapore and Ho Chi Minh City.',
    content: 'SENTINEL has successfully initialized new physical and logical nodes in the Southeast Asia corridor. The Singapore (SG-01) and Ho Chi Minh (VNM-02) gateways are now operational, providing 40% lower latency for partners operating in those regions. Network admins should re-route traffic through these nodes during the next maintenance window.'
  },
  { 
    id: 3, 
    title: 'SENTINEL-OWL v3.4 Patch Notes', 
    category: 'Advisory', 
    date: '2025-05-08', 
    author: 'AI Development Lab',
    excerpt: 'Enhanced risk predictive modeling is now active across all sector dashboards.',
    content: 'Version 3.4 of the SENTINEL-OWL core has been deployed. This update introduces a more nuanced heuristic for "Silent Risk" detection—identifying partner instability before traditional financial metrics reflect it. Users will notice new "Intelligence Confidence" scores in the partner directory and improved natural language processing in the Decision Room exchange.'
  },
];

const DecisionRoom: React.FC = () => {
  const [viewMode, setViewMode] = useState<'bulletins' | 'archive'>('bulletins');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 relative">
      {/* Notice Reader Overlay */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-20">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setSelectedNotice(null)}></div>
          <div className="relative glass-panel w-full max-w-3xl max-h-full overflow-y-auto rounded-3xl p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedNotice(null)}
              className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-slate-400"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="mb-8">
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded border mb-4 inline-block ${
                selectedNotice.category === 'Urgent' ? 'text-rose-400 border-rose-900 bg-rose-950/20' :
                selectedNotice.category === 'Update' ? 'text-emerald-400 border-emerald-900 bg-emerald-950/20' :
                'text-slate-400 border-slate-800 bg-slate-900/40'
              }`}>
                {selectedNotice.category}
              </span>
              <h2 className="text-4xl font-light serif text-white mb-4">{selectedNotice.title}</h2>
              <div className="flex items-center text-[10px] text-slate-500 uppercase tracking-widest space-x-4">
                <span><i className="fas fa-calendar-alt mr-2"></i>{selectedNotice.date}</span>
                <span><i className="fas fa-user-shield mr-2"></i>{selectedNotice.author}</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed text-lg serif mb-8">
                {selectedNotice.content}
              </p>
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                 <p className="text-xs text-slate-500 italic">
                   This document is classified under Sentinel Protocol Level-2. Redistribution without authorization from {selectedNotice.author} is prohibited.
                 </p>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
               <button 
                 onClick={() => setSelectedNotice(null)}
                 className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
               >
                 Acknowledge & Close
               </button>
            </div>
          </div>
        </div>
      )}

      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-light serif text-white mb-2">Bulletin Room</h2>
          <p className="text-slate-400">Official announcements and archived partner directives.</p>
        </div>
        <div className="flex space-x-2">
           <button 
             onClick={() => setViewMode('bulletins')}
             className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
               viewMode === 'bulletins' ? 'bg-white text-black border-white' : 'text-slate-500 border-white/10 hover:border-white/20'
             }`}
           >
             Bulletins
           </button>
           <button 
             onClick={() => setViewMode('archive')}
             className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
               viewMode === 'archive' ? 'bg-white text-black border-white' : 'text-slate-500 border-white/10 hover:border-white/20'
             }`}
           >
             Bulletin Archive
           </button>
        </div>
      </header>

      {viewMode === 'bulletins' ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-left-4 duration-500">
          <div className="lg:col-span-12 flex flex-col space-y-6">
            <div className="glass-panel p-10 rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center">
                  <i className="fas fa-bullhorn mr-3 text-slate-600"></i>
                  Strategic Bulletins
                </h3>
                <button
                  onClick={() => setViewMode('archive')}
                  className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center"
                >
                  View Archive <i className="fas fa-chevron-right ml-2 text-[8px]"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {NOTICES.map((notice) => (
                  <div 
                    key={notice.id} 
                    className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-white/20 hover:bg-white/[0.07] transition-all cursor-pointer group"
                    onClick={() => setSelectedNotice(notice)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${
                        notice.category === 'Urgent' ? 'text-rose-400 border-rose-900 bg-rose-950/20' :
                        notice.category === 'Update' ? 'text-emerald-400 border-emerald-900 bg-emerald-950/20' :
                        'text-slate-400 border-slate-800 bg-slate-900/40'
                      }`}>
                        {notice.category}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">{notice.date}</span>
                    </div>
                    <h4 className="text-sm font-medium text-white mb-3 group-hover:text-slate-200">{notice.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {notice.excerpt}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-[9px] uppercase tracking-widest text-slate-600 group-hover:text-slate-400">
                      <span>Read Full Bulletin</span>
                      <i className="fas fa-arrow-right ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 animate-in slide-in-from-right-4 duration-500">
          <div className="glass-panel rounded-3xl p-10 min-h-[600px]">
            <div className="flex justify-between items-center mb-10">
               <div>
                 <h3 className="text-2xl font-light serif text-white mb-2">Notice Archive</h3>
                 <p className="text-xs text-slate-500 uppercase tracking-widest">Global Directives & Network Advisories</p>
               </div>
               <button 
                 onClick={() => setViewMode('bulletins')}
                 className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center"
               >
                 <i className="fas fa-arrow-left mr-2"></i> Back to Bulletins
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {NOTICES.map((notice) => (
                 <div 
                   key={notice.id} 
                   onClick={() => setSelectedNotice(notice)}
                   className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:border-white/30 hover:bg-white/[0.08] transition-all cursor-pointer group relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <i className={`fas ${notice.category === 'Urgent' ? 'fa-exclamation-triangle' : 'fa-info-circle'} text-6xl`}></i>
                    </div>
                    
                    <div className="flex justify-between items-start mb-6">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded border ${
                        notice.category === 'Urgent' ? 'text-rose-400 border-rose-900 bg-rose-950/20' :
                        notice.category === 'Update' ? 'text-emerald-400 border-emerald-900 bg-emerald-950/20' :
                        'text-slate-400 border-slate-800 bg-slate-900/40'
                      }`}>
                        {notice.category}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono uppercase tracking-tighter">{notice.date}</span>
                    </div>

                    <h4 className="text-xl font-medium text-white mb-4 group-hover:text-slate-200 transition-colors leading-tight">
                      {notice.title}
                    </h4>
                    
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      {notice.excerpt}
                    </p>

                    <div className="flex items-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                       <span>Issued by {notice.author}</span>
                       <span className="ml-auto flex items-center group-hover:text-white transition-colors">
                         View Notice <i className="fas fa-chevron-right ml-2 text-[8px]"></i>
                       </span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionRoom;
