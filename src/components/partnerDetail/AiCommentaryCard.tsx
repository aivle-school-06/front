import React from 'react';

interface AiCommentaryCardProps {
  commentary: string;
}

const AiCommentaryCard: React.FC<AiCommentaryCardProps> = ({ commentary }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 p-8">
      <div className="mb-4 flex items-center gap-2">
        <i className="fas fa-brain text-slate-500"></i>
        <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">AI 분석 코멘트</span>
      </div>
      <p className="whitespace-pre-line text-lg font-light text-slate-200 leading-relaxed italic">{commentary}</p>
    </div>
  );
};

export default AiCommentaryCard;
