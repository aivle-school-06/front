import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AsyncState from '../components/common/AsyncState';
import AiCommentaryCard from '../components/partnerDetail/AiCommentaryCard';
import ForecastChartPanel from '../components/partnerDetail/ForecastChartPanel';
import MetricsPanel from '../components/partnerDetail/MetricsPanel';
import { fetchPartnerDetail } from '../services/partnersApi';
import { PartnerDetail as PartnerDetailType } from '../types/partner';

const statusStyles: Record<string, string> = {
  정상: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
  주의: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  위험: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
};

const PartnerDetailPage: React.FC = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<PartnerDetailType | null>(null);

  const loadDetail = async () => {
    if (!id) {
      setError('협력사 식별 정보를 찾을 수 없습니다.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchPartnerDetail(id);
      setDetail(response);
    } catch (err) {
      setError('협력사 상세 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDetail();
  }, [id]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <AsyncState
        isLoading={isLoading}
        error={error}
        empty={!isLoading && !error && !detail}
        onRetry={loadDetail}
        emptyMessage="협력사 상세 정보가 없습니다."
      >
        {detail && (
          <>
            <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl text-white">
                  {detail.partner.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-light text-white serif">{detail.partner.name}</h2>
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${
                        statusStyles[detail.partner.status]
                      }`}
                    >
                      {detail.partner.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                    산업군 {detail.partner.industry} · 기업 ID {detail.partner.id}
                  </p>
                </div>
              </div>
              <Link
                to="/partners"
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-500 transition hover:text-white"
              >
                <i className="fas fa-chevron-left"></i>
                협력사 목록으로
              </Link>
            </header>

            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
              <ForecastChartPanel data={detail.forecast} />
              <MetricsPanel metrics={detail.metrics} signals={detail.trafficSignals} />
            </div>

            <AiCommentaryCard commentary={detail.aiCommentary} />
          </>
        )}
      </AsyncState>
    </div>
  );
};

export default PartnerDetailPage;
