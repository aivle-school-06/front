import React from 'react';
import { RiskDistribution } from '../../types/dashboard';
import RiskDistributionDonut from './RiskDistributionDonut';

interface RiskDistributionCardProps {
  distribution: RiskDistribution;
}

const RiskDistributionCard: React.FC<RiskDistributionCardProps> = ({ distribution }) => {
  return (
    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center">
      <h3 className="text-lg font-medium text-white self-start mb-8">위험 분포</h3>
      <RiskDistributionDonut />
      <div className="mt-4 grid grid-cols-2 gap-4 w-full">
        <div className="p-3 bg-white/5 rounded-xl text-center">
          <div className="text-xs text-slate-500 mb-1">평균 위험도</div>
          <div className="text-xl font-light text-white">{distribution.avgRiskLabel}</div>
        </div>
        <div className="p-3 bg-white/5 rounded-xl text-center">
          <div className="text-xs text-slate-500 mb-1">주요 섹터</div>
          <div className="text-xl font-light text-white">{distribution.topSector}</div>
        </div>
      </div>
    </div>
  );
};

export default RiskDistributionCard;
