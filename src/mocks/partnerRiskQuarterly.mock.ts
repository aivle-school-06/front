import { PartnerQuarterRisk, RiskLevel } from '../types/risk';

const quarters = [
  '2023Q3',
  '2023Q4',
  '2024Q1',
  '2024Q2',
  '2024Q3',
  '2024Q4',
  '2025Q1',
  '2025Q2',
];

const partnerPatterns: Array<{
  partnerId: string;
  partnerName: string;
  levels: RiskLevel[];
}> = [
  {
    partnerId: 'PT-001',
    partnerName: 'Alpha Logistics',
    levels: ['MIN', 'MIN', 'WARN', 'WARN', 'RISK', 'MIN', 'MIN', 'MIN'],
  },
  {
    partnerId: 'PT-002',
    partnerName: 'Beta Components',
    levels: ['WARN', 'WARN', 'WARN', 'RISK', 'RISK', 'WARN', 'MIN', 'MIN'],
  },
  {
    partnerId: 'PT-003',
    partnerName: 'Gamma Retail',
    levels: ['MIN', 'MIN', 'MIN', 'MIN', 'MIN', 'MIN', 'MIN', 'MIN'],
  },
  {
    partnerId: 'PT-004',
    partnerName: 'Delta Mobility',
    levels: ['MIN', 'WARN', 'MIN', 'WARN', 'WARN', 'MIN', 'RISK', 'RISK'],
  },
  {
    partnerId: 'PT-005',
    partnerName: 'Epsilon Energy',
    levels: ['RISK', 'RISK', 'RISK', 'RISK', 'WARN', 'WARN', 'WARN', 'WARN'],
  },
  {
    partnerId: 'PT-006',
    partnerName: 'Zeta Robotics',
    levels: ['MIN', 'WARN', 'WARN', 'MIN', 'MIN', 'WARN', 'RISK', 'MIN'],
  },
  {
    partnerId: 'PT-007',
    partnerName: 'Eta Finance',
    levels: ['WARN', 'MIN', 'MIN', 'WARN', 'RISK', 'RISK', 'MIN', 'MIN'],
  },
  {
    partnerId: 'PT-008',
    partnerName: 'Theta Healthcare',
    levels: ['MIN', 'MIN', 'WARN', 'MIN', 'WARN', 'MIN', 'WARN', 'MIN'],
  },
  {
    partnerId: 'PT-009',
    partnerName: 'Iota Manufacturing',
    levels: ['MIN', 'RISK', 'RISK', 'RISK', 'MIN', 'MIN', 'WARN', 'WARN'],
  },
  {
    partnerId: 'PT-010',
    partnerName: 'Kappa Media',
    levels: ['MIN', 'MIN', 'MIN', 'WARN', 'WARN', 'WARN', 'MIN', 'RISK'],
  },
];

export const partnerRiskQuarterlyMock: PartnerQuarterRisk[] = partnerPatterns.flatMap(
  (partner) =>
    quarters.map((quarter, index) => ({
      partnerId: partner.partnerId,
      partnerName: partner.partnerName,
      quarter,
      riskLevel: partner.levels[index],
    })),
);
