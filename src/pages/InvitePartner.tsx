import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InvitePartnerForm from '../components/invite/InvitePartnerForm';
import { uploadPartnerFile } from '../services/partnersApi';
import { addPartner } from '../store/partnersStore';
import { UploadResult } from '../types/partner';

const InvitePartnerPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const response = await uploadPartnerFile(formData);
      addPartner(response.partner);
      setResult(response);
    } catch (err) {
      setError('파일 업로드에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col gap-4">
        <h2 className="text-4xl font-light text-white serif">기업 추가 업로드</h2>
        <p className="text-slate-400">
          신규 협력사 자료를 업로드하면 AI 분석 시뮬레이션을 통해 초기 건강도와 리스크를 추정합니다.
        </p>
        <button
          type="button"
          onClick={() => navigate('/partners')}
          className="text-left text-[11px] uppercase tracking-[0.3em] text-slate-500 hover:text-white"
        >
          ← 협력사 목록으로 돌아가기
        </button>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <InvitePartnerForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          {error && (
            <p className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-[11px] uppercase tracking-[0.3em] text-slate-500">업로드 가이드</h3>
          <ul className="mt-6 space-y-4 text-sm text-slate-300">
            <li>• 최근 3개 분기 재무 요약 PDF 또는 CSV 업로드</li>
            <li>• 핵심 거래처/계약 정보가 포함되면 분석 정확도가 향상됩니다.</li>
            <li>• 업로드 완료 시 목록에 즉시 반영됩니다.</li>
          </ul>
        </div>
      </div>

      {result && (
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 p-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center">
              <i className="fas fa-check"></i>
            </div>
            <div>
              <p className="text-lg text-white">{result.message}</p>
              <p className="text-sm text-slate-400">
                초기 상태: {result.partner.status} · 건강도 {result.partner.healthScore}%
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              to="/partners"
              className="flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.3em] text-white hover:bg-white/5"
            >
              협력사 목록으로 이동
            </Link>
            <Link
              to={`/partners/${result.partner.id}`}
              className="flex items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.3em] text-slate-900"
            >
              바로 상세 분석 보기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitePartnerPage;
