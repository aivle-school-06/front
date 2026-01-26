import React from 'react';
import { PartnerMetric, TrafficLight } from '../../types/partner';

interface MetricsPanelProps {
  metrics: PartnerMetric[];
  signals: Array<{ label: string; status: TrafficLight }>;
}

const signalColor: Record<TrafficLight, string> = {
  green: 'bg-emerald-400',
  yellow: 'bg-amber-400',
  red: 'bg-rose-400',
};

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, signals }) => {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h4 className="text-[11px] uppercase tracking-[0.3em] text-slate-500">핵심 지표</h4>
        <div className="mt-6 space-y-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">{metric.label}</p>
              <p className="mt-2 text-2xl font-light text-white">{metric.value}</p>
              {metric.description && (
                <p className="mt-1 text-[11px] text-slate-500">{metric.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h4 className="text-[11px] uppercase tracking-[0.3em] text-slate-500">보조 지표 신호등</h4>
        <div className="mt-6 space-y-3">
          {signals.map((signal) => (
            <div key={signal.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">{signal.label}</span>
              <span className={`h-3 w-3 rounded-full ${signalColor[signal.status]} shadow-[0_0_12px_rgba(255,255,255,0.15)]`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
