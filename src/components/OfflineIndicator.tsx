import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs font-medium"
    >
      <div className="max-w-[1360px] mx-auto flex items-center justify-center gap-2 text-center">
        <WifiOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>
          Offline Mode — Guided lessons, IOS CLI labs, subnetting drills, and mock exams remain
          active locally (Coach Ping requires internet).
        </span>
      </div>
    </div>
  );
}
