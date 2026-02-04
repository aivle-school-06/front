import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BulletinGrid from '../../components/decisionRoom/BulletinGrid';
import BulletinModal from '../../components/decisionRoom/BulletinModal';
import AsyncState from '../../components/common/AsyncState';
import { Bulletin } from '../../types/decisionRoom';
import { fetchBulletins } from '../../services/decisionRoomApi';

const NoticesPage: React.FC = () => {
  const [noticeMode, setNoticeMode] = useState<'active' | 'archive'>('active');
  const [notices, setNotices] = useState<Bulletin[]>([]);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const [isLoadingNotices, setIsLoadingNotices] = useState<boolean>(false);
  const [errorNotices, setErrorNotices] = useState<string | null>(null);

  const loadNotices = useCallback(async () => {
    setIsLoadingNotices(true);
    setErrorNotices(null);

    try {
      const response = await fetchBulletins(noticeMode);
      setNotices(response);
    } catch (error) {
      setErrorNotices('공지 데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setIsLoadingNotices(false);
    }
  }, [noticeMode]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const selectedNotice = useMemo(
    () => notices.find((notice) => notice.id === selectedNoticeId) ?? null,
    [notices, selectedNoticeId]
  );

  return (
    <div className="animate-in fade-in duration-700 space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-4xl font-light serif text-white mb-2">Decision Room Notices</h2>
          <p className="text-slate-400">Official company notices.</p>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setNoticeMode('active')}
            className={`px-4 py-1.5 text-[9px] uppercase tracking-[0.3em] font-semibold rounded-full transition-all ${
              noticeMode === 'active'
                ? 'bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.15)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Notices
          </button>
          <button
            type="button"
            onClick={() => setNoticeMode('archive')}
            className={`px-4 py-1.5 text-[9px] uppercase tracking-[0.3em] font-semibold rounded-full transition-all ${
              noticeMode === 'archive'
                ? 'bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.15)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Notice Archive
          </button>
        </div>
      </header>

      <div className="glass-panel rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-light serif text-white mb-2">Strategic Notices</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest">
              {noticeMode === 'active'
                ? 'Active notices for company operations'
                : 'Archived notices & advisories'}
            </p>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
            {noticeMode === 'active' ? 'LIVE FEED' : 'ARCHIVE'}
          </div>
        </div>

        <AsyncState
          isLoading={isLoadingNotices}
          error={errorNotices}
          empty={!isLoadingNotices && !errorNotices && notices.length === 0}
          onRetry={loadNotices}
          emptyMessage="공지 사항이 준비되면 여기에 표시됩니다."
        >
          <BulletinGrid bulletins={notices} onOpen={setSelectedNoticeId} />
        </AsyncState>
      </div>

      <BulletinModal
        open={Boolean(selectedNoticeId)}
        bulletin={selectedNotice}
        onClose={() => setSelectedNoticeId(null)}
      />
    </div>
  );
};

export default NoticesPage;
