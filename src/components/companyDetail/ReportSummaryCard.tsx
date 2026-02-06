import React from 'react';

interface ReportSummaryCardProps {
  summary: string;
  className?: string;
}

const ReportSummaryCard: React.FC<ReportSummaryCardProps> = ({ summary, className }) => {
  const lines = summary
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const fallbackSummary = summary.trim().length > 0 ? summary : '사업보고서 요약을 불러오는 중입니다.';
  const bulletItems = lines.slice(1, 3);

  return (
    <div
      className={`flex h-[380px] flex-col rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur ${
        className ?? ''
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <i className="fas fa-file-alt text-slate-500"></i>
        <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
          사업보고서 설명
        </span>
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-line">{fallbackSummary}</p>
        {summary.trim().length === 0 && (
          <ul className="mt-3 list-disc space-y-1 pl-4 text-[11px] text-slate-400">
            {bulletItems.length > 0 ? (
              bulletItems.map((item) => <li key={item}>{item}</li>)
            ) : (
              <>
                <li>최근 분기 사업보고서 핵심 내용을 준비 중입니다.</li>
                <li>재무 및 리스크 요약을 정리하고 있습니다.</li>
              </>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReportSummaryCard;
