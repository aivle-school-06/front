import React from 'react';

interface AsyncStateProps {
  isLoading: boolean;
  error?: string | null;
  empty?: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
  emptyMessage?: string;
}

const AsyncState: React.FC<AsyncStateProps> = ({
  isLoading,
  error,
  empty,
  onRetry,
  children,
  emptyMessage,
}) => {
  if (isLoading) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center text-slate-300 animate-pulse">
        <div className="text-sm uppercase tracking-[0.3em] text-slate-500">Loading</div>
        <div className="mt-4 h-2 w-32 bg-white/10 rounded mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center text-slate-300">
        <div className="text-lg font-medium text-white mb-2">데이터를 불러오지 못했습니다.</div>
        <p className="text-sm text-slate-500 mb-6">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2 rounded-lg bg-white/10 border border-white/20 text-sm text-white hover:bg-white/20 transition"
          >
            다시 시도
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center text-slate-400">
        <div className="text-lg text-white mb-2">표시할 데이터가 없습니다.</div>
        <p className="text-sm text-slate-500">
          {emptyMessage ?? '데이터가 준비되면 이 영역에 표시됩니다.'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AsyncState;
