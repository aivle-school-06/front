import React, { useState } from 'react';

interface InvitePartnerFormProps {
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

const InvitePartnerForm: React.FC<InvitePartnerFormProps> = ({ onSubmit, isSubmitting }) => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('industry', industry);
    if (file) {
      formData.append('file', file);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm text-slate-300">
          기업명
          <input
            type="text"
            required
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="예: 미래테크솔루션"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
          />
        </label>
        <label className="block text-sm text-slate-300">
          산업군
          <input
            type="text"
            required
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            placeholder="예: AI/데이터"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
          />
        </label>
      </div>

      <label className="block text-sm text-slate-300">
        분석 자료 업로드 (PDF/CSV)
        <div className="mt-2 flex items-center justify-between rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-4">
          <div className="text-sm text-slate-400">
            {file ? file.name : '파일을 선택해 주세요.'}
          </div>
          <input
            type="file"
            accept=".pdf,.csv"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="text-xs text-slate-300"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-gradient-to-r from-slate-100 to-white py-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? '분석 시뮬레이션 진행 중' : '분석 시뮬레이션 시작'}
      </button>
    </form>
  );
};

export default InvitePartnerForm;
