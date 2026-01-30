import React from 'react';

interface AiCommentaryCardProps {
  commentary: string;
  variant?: 'standalone' | 'embedded';
  className?: string;
}

const AiCommentaryCard: React.FC<AiCommentaryCardProps> = ({
  commentary,
  variant = 'standalone',
  className,
}) => {
  const lines = commentary
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const summary = lines.slice(0, 2).join(' ');
  const bulletItems = lines.slice(2, 4);
  const fallbackSummary = summary || 'AI 분석 코멘트를 수집 중입니다.';
  const fallbackBullets =
    bulletItems.length > 0
      ? bulletItems
      : ['최근 30일 핵심 지표 변화를 기반으로 분석을 준비합니다.'];

  if (variant === 'embedded') {
    return (
      <div
        className={`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur ${className ?? ''}`}
      >
        <div className="mb-3 flex items-center gap-2">
          <i className="fas fa-brain text-slate-500"></i>
          <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
            AI 분석 코멘트
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-200 line-clamp-3">
          {fallbackSummary}
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-4 text-[11px] text-slate-400">
          {fallbackBullets.slice(0, 2).map((item) => (
            <li key={item} className="line-clamp-2">
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 p-8 ${
        className ?? ''
      }`}
    >
      <div className="mb-4 flex items-center gap-2">
        <i className="fas fa-brain text-slate-500"></i>
        <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">AI 분석 코멘트</span>
      </div>
      <p className="whitespace-pre-line text-lg font-light text-slate-200 leading-relaxed italic">
        {commentary}
      </p>
    </div>
  );
};

export default AiCommentaryCard;
