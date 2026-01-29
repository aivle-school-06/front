import { Quarter, RiskStatusTrendPayload } from './types';

const MOCK_TRENDS: Record<Quarter, RiskStatusTrendPayload> = {
  '2025Q3': {
    latestActualQuarter: '2025Q3',
    forecastQuarter: '2025Q4',
    windowQuarters: ['2024Q4', '2025Q1', '2025Q2', '2025Q3', '2025Q4'],
    trend: [
      { quarter: '2024Q4', dataType: 'ACTUAL', NORMAL: 62, CAUTION: 25, RISK: 13 },
      { quarter: '2025Q1', dataType: 'ACTUAL', NORMAL: 60, CAUTION: 26, RISK: 14 },
      { quarter: '2025Q2', dataType: 'ACTUAL', NORMAL: 58, CAUTION: 27, RISK: 15 },
      { quarter: '2025Q3', dataType: 'ACTUAL', NORMAL: 56, CAUTION: 28, RISK: 16 },
      { quarter: '2025Q4', dataType: 'FORECAST', NORMAL: 54, CAUTION: 29, RISK: 17 },
    ],
    unit: 'RATIO',
  },
};

export const makeMockRiskStatusTrend = (latestActualQuarter: Quarter): RiskStatusTrendPayload => {
  const mock = MOCK_TRENDS[latestActualQuarter];

  if (!mock) {
    console.warn('[RiskStatusTrend] Unsupported latestActualQuarter in mock data.', {
      latestActualQuarter,
    });
    return MOCK_TRENDS['2025Q3'];
  }

  return mock;
};
