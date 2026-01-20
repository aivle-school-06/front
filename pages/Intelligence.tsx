
import React from 'react';

const Intelligence: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-4xl font-light serif text-white mb-2">Market Intelligence</h2>
        <p className="text-slate-400">High-fidelity analysis of external market forces and partner alignment.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border-l-4 border-slate-400">
          <h3 className="text-xl font-medium text-white mb-4">Predictive Risk Modeling</h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Our neural patterns suggest a 14% shift in the logistics sector over the next fiscal quarter. 
            Recommend diversifying tier-2 partner dependencies in East-Asian corridors.
          </p>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] border border-white/10 text-slate-400">Supply Chain</span>
            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] border border-white/10 text-slate-400">Medium Priority</span>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl">
           <h3 className="text-xl font-medium text-white mb-4">Network Synergies</h3>
           <div className="space-y-4">
              {[
                { p1: 'Aurum', p2: 'Ironwood', score: '94%' },
                { p1: 'Nebula', p2: 'Solaris', score: '82%' },
                { p1: 'Vertex', p2: 'BioGen', score: '44%' },
              ].map((syn, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                   <div className="flex items-center space-x-2">
                      <span className="text-xs text-white">{syn.p1}</span>
                      <i className="fas fa-link text-[10px] text-slate-600"></i>
                      <span className="text-xs text-white">{syn.p2}</span>
                   </div>
                   <span className={`text-xs font-bold ${Number(syn.score.replace('%','')) > 80 ? 'text-emerald-500' : 'text-slate-500'}`}>{syn.score}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="md:col-span-2 glass-panel p-10 rounded-3xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <i className="fas fa-shield-cat text-9xl"></i>
           </div>
           <div className="max-w-xl">
             <h3 className="text-2xl serif text-white mb-4">Strategic Recommendation</h3>
             <p className="text-slate-400 mb-8 leading-relaxed italic">
               "The wise owl watches before it strikes. Currently, the ecosystem requires consolidation rather than expansion. Focus on deepening existing high-value bonds (Health Score > 90%) while sunsetting underperforming legacy nodes."
             </p>
             <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform">
               Execute Consolidation Plan
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
