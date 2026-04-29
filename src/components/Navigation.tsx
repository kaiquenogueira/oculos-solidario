import { Home, Search, Heart, PlusCircle, MessageCircle, User as UserIcon } from 'lucide-react';

type Tab = 'home' | 'search' | 'solidarity' | 'new' | 'chat' | 'profile';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs: { id: Tab; icon: typeof Home; label: string; accent?: boolean }[] = [
    { id: 'home',       icon: Home,          label: 'Início' },
    { id: 'search',     icon: Search,        label: 'Busca' },
    { id: 'new',        icon: PlusCircle,    label: 'Criar',      accent: true },
    { id: 'solidarity', icon: Heart,         label: 'Solidário' },
    { id: 'chat',       icon: MessageCircle, label: 'Chat' },
    { id: 'profile',    icon: UserIcon,      label: 'Perfil' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center px-2 pt-2 pb-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          const isCreate = tab.accent;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center py-1 px-2 min-w-[52px] min-h-[48px]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              {isCreate ? (
                <div
                  className="w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    background: active ? 'var(--color-rust)' : 'var(--color-ink)',
                    color: 'var(--color-paper)',
                    boxShadow: active ? '0 2px 12px rgba(192,57,26,0.35)' : 'none',
                  }}
                >
                  <tab.icon size={20} strokeWidth={2} />
                </div>
              ) : (
                <>
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                    style={{
                      background: active ? 'rgba(192,57,26,0.1)' : 'transparent',
                    }}
                  >
                    <tab.icon
                      size={20}
                      strokeWidth={active ? 2.2 : 1.6}
                      style={{
                        color: active ? 'var(--color-rust)' : 'var(--color-ink-4)',
                        transition: 'color 0.2s ease',
                      }}
                    />
                  </div>
                  <span
                    className="mt-0.5 transition-all duration-200"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: active ? 'var(--color-rust)' : 'var(--color-ink-4)',
                      fontSize: '10px',
                      fontWeight: active ? 600 : 400,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
