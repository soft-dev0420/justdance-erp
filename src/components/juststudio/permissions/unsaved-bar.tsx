import { AlertTriangle } from 'lucide-react';

export function UnsavedBar({ roleName, onSave, onDiscard, isSaving }: { roleName: string; onSave: () => void; onDiscard: () => void; isSaving?: boolean }) {
  return (
    <div
      className="absolute bottom-6 left-1/2 z-30 w-[calc(100%-2rem)] max-w-[600px] -translate-x-1/2 rounded-2xl border border-white/30 bg-white/90 p-4 shadow-xl backdrop-blur-md"
      style={{ animation: 'slideUp 0.35s ease-out forwards' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertTriangle size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Unsaved changes</p>
            <p className="text-xs text-gray-500">You have unsaved changes to &lsquo;{roleName}&rsquo;</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onDiscard} className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
