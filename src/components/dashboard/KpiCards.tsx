import React, { useMemo } from 'react';
import { DashboardKpis, KpiCard as KpiCardData } from '../../types/dashboard';
import { PartnerQuarterRisk } from '../../types/risk';
import { computeDwellTimeDelta, getRecentQuarterWindows } from '../../utils/kpi';
import KpiCard from '../kpi/KpiCard';

interface KpiCardsProps {
  kpis: DashboardKpis;
  riskRecords: PartnerQuarterRisk[];
}

const formatDelta = (value?: number, suffix = '%'): string | undefined => {
  if (value === undefined) return undefined;
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}${suffix}`;
};

const formatDecimal = (value: number): string => value.toFixed(1);

const KpiCards: React.FC<KpiCardsProps> = ({ kpis, riskRecords }) => {
  const { currentWindow, previousWindow } = useMemo(
    () => getRecentQuarterWindows(riskRecords, 4),
    [riskRecords],
  );

  const { value: dwellValue, delta: dwellDelta } = useMemo(
    () => computeDwellTimeDelta(riskRecords, currentWindow, previousWindow),
    [currentWindow, previousWindow, riskRecords],
  );

  const dwellValueText = dwellValue === null ? '—' : formatDecimal(dwellValue);
  const dwellDeltaText =
    dwellDelta === null ? '—' : `${dwellDelta > 0 ? '+' : ''}${formatDecimal(dwellDelta)}`;

  const dwellTone: KpiCardData['tone'] =
    dwellDelta === null || dwellDelta === 0
      ? 'neutral'
      : dwellDelta > 0
      ? 'negative'
      : 'positive';

  const cards: KpiCardData[] = [
    {
      label: '활성 파트너',
      valueText: kpis.activePartners.value.toString(),
      deltaText: formatDelta(kpis.activePartners.deltaPct),
      icon: 'fa-users',
      tone:
        kpis.activePartners.deltaPct !== undefined && kpis.activePartners.deltaPct < 0
          ? 'negative'
          : 'positive',
    },
    {
      label: '리스크 체류 기간',
      valueText: dwellValueText,
      unit: '분기',
      deltaText: dwellDeltaText,
      icon: 'fa-hourglass-half',
      tone: dwellTone,
    },
    {
      label: '위험 지수',
      valueText: kpis.riskIndex.label,
      deltaText: kpis.riskIndex.deltaText,
      icon: 'fa-shield-halved',
      tone:
        kpis.riskIndex.status === 'risk'
          ? 'negative'
          : kpis.riskIndex.status === 'watch'
          ? 'neutral'
          : 'positive',
    },
    {
      label: '네트워크 상태',
      valueText: `${kpis.networkHealth.valuePct}%`,
      deltaText: formatDelta(kpis.networkHealth.deltaPct),
      icon: 'fa-heartbeat',
      tone:
        kpis.networkHealth.deltaPct !== undefined && kpis.networkHealth.deltaPct < 0
          ? 'negative'
          : 'positive',
    },
  ];

  return (
    <div className="relative z-20 grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      {cards.map((stat) => {
        const deltaDirection =
          stat.tone === 'negative' ? 'down' : stat.tone === 'neutral' ? 'flat' : 'up';
        return (
          <KpiCard
            key={stat.label}
            title={stat.label}
            value={stat.valueText}
            unit={stat.unit}
            delta={stat.deltaText ? { value: stat.deltaText, direction: deltaDirection } : undefined}
            icon={<i className={`fas ${stat.icon}`} />}
            tone={stat.tone === 'negative' ? 'risk' : stat.tone === 'neutral' ? 'warn' : 'good'}
            tooltip={{
              description:
                stat.label === '활성 파트너'
                  ? '현재 모니터링 중인 협력사 수입니다.'
                  : stat.label === '리스크 체류 기간'
                  ? "Risk Dwell Time: 파트너가 '주의/위험' 상태에 머무른 평균 기간(분기 수)입니다."
                  : stat.label === '위험 지수'
                  ? '포트폴리오 전체 위험 수준 요약 지표입니다.'
                  : '협력 네트워크의 전반적 정상 상태 비율입니다.',
              interpretation:
                stat.label === '활성 파트너'
                  ? '증가=신규 편입/재가동, 감소=종료/필터링'
                  : stat.label === '리스크 체류 기간'
                  ? '낮을수록 리스크 구간에서 빠르게 회복/탈출합니다.'
                  : stat.label === '위험 지수'
                  ? '주의·위험 구간 증가 시 원인 분석이 필요합니다.'
                  : '하락 시 특정 섹터 이상 가능성이 있습니다.',
              actionHint:
                stat.label === '활성 파트너'
                  ? '급증 시 편입 기준과 데이터 갱신을 확인하세요.'
                  : stat.label === '리스크 체류 기간'
                  ? '체류 기간이 긴 파트너를 우선 점검하고, 산업/섹터별로 체류 기간을 비교하세요.'
                  : stat.label === '위험 지수'
                  ? '위험 상위 파트너부터 상세 지표를 확인하세요.'
                  : '최근 공시·외부 변수와 함께 확인하세요.',
            }}
          />
        );
      })}
    </div>
  );
};

export default KpiCards;
