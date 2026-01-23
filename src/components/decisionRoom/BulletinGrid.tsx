import React from 'react';
import { Bulletin } from '../../types/decisionRoom';

interface BulletinGridProps {
  bulletins: Bulletin[];
  onOpen: (id: string) => void;
}

const tagStyles: Record<string, string> = {
  URGENT: 'text-rose-300 border-rose-900 bg-rose-950/40',
  UPDATE: 'text-emerald-300 border-emerald-900 bg-emerald-950/40',
  ADVISORY: 'text-sky-300 border-sky-900 bg-sky-950/40',
};

const BulletinGrid: React.FC<BulletinGridProps> = ({ bulletins, onOpen }) => {
  if (bulletins.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-3xl text-center text-slate-400">
        <div className="text-lg text-white mb-2">게시된 공지가 없습니다.</div>
        <p className="text-sm text-slate-500">새 공지가 등록되면 이곳에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {bulletins.map((bulletin) => (
        <article
          key={bulletin.id}
          className="group glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/[0.08] transition cursor-pointer flex flex-col"
          onClick={() => onOpen(bulletin.id)}
        >
          <div className="flex items-start justify-between mb-4">
            <span
              className={`text-[9px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-full border ${
                tagStyles[bulletin.tag]
              }`}
            >
              {bulletin.tag}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{bulletin.date}</span>
          </div>
          <h3 className="text-base font-semibold text-white mb-3 group-hover:text-slate-200">
            {bulletin.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{bulletin.summary}</p>
          <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-between">
            <span>{bulletin.issuedBy}</span>
            <span className="flex items-center gap-2 text-slate-400 group-hover:text-white">
              READ FULL BULLETIN <i className="fas fa-arrow-right text-[9px]"></i>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BulletinGrid;
