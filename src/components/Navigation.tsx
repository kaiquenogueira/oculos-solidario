import { Home, Search, Heart, Plus, MessageCircle, User as UserIcon } from 'lucide-react';

type Tab = 'home' | 'search' | 'solidarity' | 'new' | 'chat' | 'profile';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs: { id: Tab; icon: typeof Home; label: string; idx: string }[] = [
    { id: 'home',       icon: Home,          label: 'Início',     idx: '01' },
    { id: 'search',     icon: Search,        label: 'Busca',      idx: '02' },
    { id: 'solidarity', icon: Heart,         label: 'Solidário',  idx: '03' },
    { id: 'new',        icon: Plus,          label: 'Criar',      idx: '04' },
    { id: 'chat',       icon: MessageCircle, label: 'Conversas',  idx: '05' },
    { id: 'profile',    icon: UserIcon,      label: 'Perfil',     idx: '06' },
  ];

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-40 px-2 pt-3 pb-3"
      style={{
        background: 'var(--color-paper)',
        borderTop: '1px solid rgba(26,22,18,0.18)',
        boxShadow: '0 -8px 24px -16px rgba(26,22,18,0.18)',
      }}
    >
      <div className="flex justify-between items-end px-2">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-end pt-1 pb-0.5 px-1.5 group"
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className="numeral text-[8px] mb-1 transition-opacity"
                style={{
                  color: active ? 'var(--color-rust)' : 'var(--color-ink-4)',
                  opacity: active ? 1 : 0.45,
                }}
              >
                {tab.idx}
              </span>
              <tab.icon
                size={18}
                strokeWidth={active ? 2 : 1.5}
                style={{ color: active ? 'var(--color-ink)' : 'var(--color-ink-3)' }}
              />
              <span
                className="font-mono mt-1 transition-all"
                style={{
                  color: active ? 'var(--color-ink)' : 'var(--color-ink-4)',
                  fontSize: '8.5px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontWeight: active ? 600 : 400,
                }}
              >
                {tab.label}
              </span>
              {active && (
                <span
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-px"
                  style={{ background: 'var(--color-rust)' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
