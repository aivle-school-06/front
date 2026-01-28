export type RiskLevel = 'MIN' | 'WARN' | 'RISK';

export interface PartnerQuarterRisk {
  partnerId: string;
  partnerName: string;
  quarter: string; // '2025Q1' 형식
  riskLevel: RiskLevel;
}
