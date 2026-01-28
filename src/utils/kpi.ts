import { PartnerQuarterRisk, RiskLevel } from '../types/risk';

const RISK_LEVELS: RiskLevel[] = ['WARN', 'RISK'];

const getQuarterIndex = (quarter: string): number => {
  const match = quarter.match(/(\d{4})Q([1-4])/);
  if (!match) return 0;
  const year = Number(match[1]);
  const q = Number(match[2]);
  return year * 4 + q;
};

const isRiskLevel = (riskLevel: RiskLevel): boolean => RISK_LEVELS.includes(riskLevel);

const sortByQuarter = (a: PartnerQuarterRisk, b: PartnerQuarterRisk): number =>
  getQuarterIndex(a.quarter) - getQuarterIndex(b.quarter);

const uniqueSortedQuarters = (records: PartnerQuarterRisk[]): string[] => {
  const quarters = Array.from(new Set(records.map((record) => record.quarter)));
  return quarters.sort((a, b) => getQuarterIndex(a) - getQuarterIndex(b));
};

const average = (values: number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

const aggregateRuns = (values: number[], mode: 'average' | 'median' = 'average'): number =>
  mode === 'median' ? median(values) : average(values);

export const computeDwellRunsByPartner = (records: PartnerQuarterRisk[]): number[] => {
  const runs: number[] = [];
  const recordsByPartner = records.reduce<Record<string, PartnerQuarterRisk[]>>((acc, record) => {
    if (!acc[record.partnerId]) {
      acc[record.partnerId] = [];
    }
    acc[record.partnerId].push(record);
    return acc;
  }, {});

  Object.values(recordsByPartner).forEach((partnerRecords) => {
    const sortedRecords = [...partnerRecords].sort(sortByQuarter);
    let currentRun = 0;
    let previousIndex: number | null = null;
    let previousWasRisk = false;

    sortedRecords.forEach((record) => {
      const currentIndex = getQuarterIndex(record.quarter);
      const consecutive = previousIndex !== null && currentIndex === previousIndex + 1;
      const risk = isRiskLevel(record.riskLevel);

      if (risk) {
        if (currentRun > 0 && previousWasRisk && consecutive) {
          currentRun += 1;
        } else {
          if (currentRun > 0) {
            runs.push(currentRun);
          }
          currentRun = 1;
        }
      } else if (currentRun > 0) {
        runs.push(currentRun);
        currentRun = 0;
      }

      previousIndex = currentIndex;
      previousWasRisk = risk;
    });

    if (currentRun > 0) {
      runs.push(currentRun);
    }
  });

  return runs;
};

export const computeDwellTimeAvg = (
  records: PartnerQuarterRisk[],
  windowQuarters?: string[],
  mode: 'average' | 'median' = 'average',
): number | null => {
  const scopedRecords = windowQuarters
    ? records.filter((record) => windowQuarters.includes(record.quarter))
    : records;

  if (scopedRecords.length === 0) {
    return null;
  }

  const runs = computeDwellRunsByPartner(scopedRecords);
  if (runs.length === 0) {
    return 0;
  }

  return aggregateRuns(runs, mode);
};

export const getRecentQuarterWindows = (
  records: PartnerQuarterRisk[],
  windowSize = 4,
): { currentWindow: string[]; previousWindow: string[] } => {
  const quarters = uniqueSortedQuarters(records);
  const currentWindow = quarters.slice(-windowSize);
  const previousWindow = quarters.slice(-windowSize * 2, -windowSize);

  return { currentWindow, previousWindow };
};

export const computeDwellTimeDelta = (
  records: PartnerQuarterRisk[],
  currentWindow: string[],
  previousWindow: string[],
  mode: 'average' | 'median' = 'average',
): { value: number | null; delta: number | null } => {
  const currentValue = computeDwellTimeAvg(records, currentWindow, mode);
  const previousValue = computeDwellTimeAvg(records, previousWindow, mode);

  if (currentValue === null) {
    return { value: null, delta: null };
  }

  if (previousValue === null) {
    return { value: currentValue, delta: null };
  }

  return { value: currentValue, delta: currentValue - previousValue };
};
