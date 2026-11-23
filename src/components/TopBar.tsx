import { Home, Menu, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LearningTrackId, WorkspaceTab } from '../types/ccna';
import { PWAInstallButton } from './PWAInstallButton';

interface TopBarProps {
  activeTab: WorkspaceTab;
  activeNavTrack: LearningTrackId | null;
  onSelectTab: (tab: WorkspaceTab) => void;
  onOpenCoach: () => void;
}

export function TopBar({ activeTab, activeNavTrack, onSelectTab, onOpenCoach }: TopBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(() => {
    const base: { id: WorkspaceTab; label: string }[] = [
      { id: 'overview', label: 'Overview' },
      { id: 'curriculum', label: 'Learn' },
    ];
    if (activeNavTrack === 'ccna') {
      base.push(
        { id: 'labs', label: 'IOS Labs' },
        { id: 'subnetting', label: 'Subnetting' },
      );
    } else if (activeNavTrack === 'it-support') {
      base.push({ id: 'simulator', label: 'Simulator' });
    }
    base.push({ id: 'exam', label: 'Mock Exams' });
    return base;
  }, [activeNavTrack]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800/90 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-sm">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        <button
          type="button"
          onClick={() => {
            onSelectTab('launch');
            setMobileOpen(false);
          }}
          aria-label="Home"
          title="Home"
          className={`p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 shrink-0 ${
            activeTab === 'launch'
              ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
        </button>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded ${
                  active
                    ? 'text-slate-950 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-sky-600 dark:bg-sky-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <PWAInstallButton />

          <button
            type="button"
            onClick={onOpenCoach}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            {activeNavTrack === 'it-support' ? 'Coach Patch' : 'Coach Ping'}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap gap-2 bg-white dark:bg-[#0B0F17]"
        >
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileOpen(false);
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-sky-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
