export type DataType = 'ACTUAL' | 'FORECAST';
export type Quarter = string; // 'YYYYQn'

export type RiskStatusBucket = {
  quarter: Quarter;
  dataType: DataType;
  NORMAL: number;
  CAUTION: number;
  RISK: number;
};

export type RiskStatusTrendPayload = {
  latestActualQuarter: Quarter;
  forecastQuarter: Quarter;
  windowQuarters: Quarter[]; // 항상 길이 5
  trend: RiskStatusBucket[]; // 항상 길이 5
  unit: 'RATIO' | 'COUNT';
};
