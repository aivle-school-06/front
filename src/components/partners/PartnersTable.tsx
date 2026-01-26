import React from 'react';
import { Link } from 'react-router-dom';
import { Partner } from '../../types/partner';

interface PartnersTableProps {
  partners: Partner[];
  onSelect: (partner: Partner) => void;
}

const statusStyles: Record<Partner['status'], string> = {
  정상: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
  주의: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  위험: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
};

const PartnersTable: React.FC<PartnersTableProps> = ({ partners, onSelect }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-[11px] uppercase tracking-[0.3em] text-slate-500">
          <tr>
            <th className="px-6 py-4">협력사명</th>
            <th className="px-6 py-4">산업군</th>
            <th className="px-6 py-4 text-center">기업 건강도</th>
            <th className="px-6 py-4">매출 규모</th>
            <th className="px-6 py-4">상태</th>
            <th className="px-6 py-4 text-right">액션</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {partners.map((partner) => (
            <tr
              key={partner.id}
              className="group cursor-pointer transition hover:bg-white/5"
              onClick={() => onSelect(partner)}
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-sm font-semibold text-white">
                    {partner.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-100">{partner.name}</div>
                    <div className="text-[11px] text-slate-500">ID {partner.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-sm text-slate-400">{partner.industry}</td>
              <td className="px-6 py-5">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-slate-300">{partner.healthScore}%</span>
                  <div className="h-1.5 w-20 rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${
                        partner.healthScore >= 80
                          ? 'bg-emerald-400'
                          : partner.healthScore >= 60
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${partner.healthScore}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-sm text-slate-300">
                {partner.revenue >= 10000
                  ? `1조 ${(partner.revenue - 10000).toLocaleString('ko-KR')}억`
                  : `${partner.revenue.toLocaleString('ko-KR')}억`}
              </td>
              <td className="px-6 py-5">
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                    statusStyles[partner.status]
                  }`}
                >
                  {partner.status}
                </span>
              </td>
              <td className="px-6 py-5 text-right">
                <Link
                  to={`/partners/${partner.id}`}
                  className="text-[10px] uppercase tracking-[0.3em] text-slate-500 transition group-hover:text-white"
                  onClick={(event) => event.stopPropagation()}
                >
                  상세 보기
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartnersTable;
