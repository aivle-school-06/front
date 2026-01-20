
import React, { useState } from 'react';
import { Partner } from '../types';

const INITIAL_PARTNERS: Partner[] = [
  { id: '1', name: 'Aurum Logistics', industry: 'Supply Chain', healthScore: 92, lastReview: '2023-11-04', status: 'Active', revenue: '$4.2M' },
  { id: '2', name: 'Nebula Cloud', industry: 'Technology', healthScore: 88, lastReview: '2024-01-12', status: 'Active', revenue: '$1.8M' },
  { id: '3', name: 'Vertex Bio', industry: 'Healthcare', healthScore: 45, lastReview: '2024-02-20', status: 'Risk', revenue: '$0.9M' },
  { id: '4', name: 'Ironwood Mfg', industry: 'Manufacturing', healthScore: 78, lastReview: '2023-10-15', status: 'Active', revenue: '$12.5M' },
  { id: '5', name: 'Solaris Energy', industry: 'Renewables', healthScore: 62, lastReview: '2024-01-05', status: 'Pending', revenue: '$2.1M' },
];

const Partners: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = INITIAL_PARTNERS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-light serif text-white mb-2">Partner Directory</h2>
          <p className="text-slate-400">Review and manage institutional collaborations.</p>
        </div>
        <button className="bg-slate-200 text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-white transition-all">
          Invite Partner
        </button>
      </header>

      <div className="mb-8 flex items-center bg-white/5 border border-white/10 p-2 rounded-2xl max-w-md">
        <i className="fas fa-search ml-3 text-slate-500"></i>
        <input 
          type="text" 
          placeholder="Search by name or industry..." 
          className="bg-transparent border-none outline-none flex-1 px-4 text-sm text-white placeholder-slate-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 glass-panel">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500">Partner</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500">Industry</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500 text-center">Health</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500">Revenue</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500">Status</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs text-white border border-white/10">
                      {p.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-200">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400">{p.industry}</td>
                <td className="px-6 py-5">
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-xs text-slate-300">{p.healthScore}%</span>
                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${p.healthScore > 80 ? 'bg-emerald-500' : p.healthScore > 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                        style={{ width: `${p.healthScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400">{p.revenue}</td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                    p.status === 'Active' ? 'text-emerald-400 border-emerald-900 bg-emerald-950/20' : 
                    p.status === 'Risk' ? 'text-rose-400 border-rose-900 bg-rose-950/20' : 
                    'text-amber-400 border-amber-900 bg-amber-950/20'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <button className="text-slate-500 hover:text-white transition-colors">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Partners;
