import { RiskStatusBucket, RiskStatusTrendPayload } from './types';

const buildEmptyBucket = (quarter: string, dataType: RiskStatusBucket['dataType']): RiskStatusBucket => ({
  quarter,
  dataType,
  NORMAL: 0,
  CAUTION: 0,
  RISK: 0,
});

export const normalizeRiskStatusTrend = (
  payload: RiskStatusTrendPayload,
): RiskStatusTrendPayload => {
  const windowQuarters = payload.windowQuarters.slice(0, 5);
  const trendMap = new Map<string, RiskStatusBucket>();

  payload.trend.forEach((bucket) => {
    if (trendMap.has(bucket.quarter)) {
      console.warn('[RiskStatusTrend] Duplicate quarter detected.', {
        quarter: bucket.quarter,
        dataType: bucket.dataType,
      });
      return;
    }
    trendMap.set(bucket.quarter, bucket);
  });

  const normalizedTrend = windowQuarters.map((quarter) => {
    const entry = trendMap.get(quarter);
    if (entry) return entry;

    const dataType = quarter === payload.forecastQuarter ? 'FORECAST' : 'ACTUAL';
    return buildEmptyBucket(quarter, dataType);
  });

  return {
    ...payload,
    windowQuarters,
    trend: normalizedTrend,
  };
};
