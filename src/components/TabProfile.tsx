import { Star, ScanLine, Eye, Shield, MessageCircle, Settings, LogOut, ArrowUpRight, ChevronRight } from 'lucide-react';
import { User, Ad } from '../store/useStore';

interface TabProfileProps {
  user: User | null; ads: Ad[]; onOpenScanner: () => void; onOpenMyAds: () => void;
  onOpenModeration: () => void; onGoToChat: () => void; onOpenSettings: () => void; onLogout: () => void;
}

export function TabProfile({ user, ads, onOpenScanner, onOpenMyAds, onOpenModeration, onGoToChat, onOpenSettings, onLogout }: TabProfileProps) {
  const myAdsCount = ads.filter(ad => ad.userId === user?.id).length;
  const initials = (user?.name || 'U').split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();

  const menuItems = [
    { icon: ScanLine, label: 'Escanear entrega', meta: 'QR', action: onOpenScanner, accent: 'rust' as const },
    { icon: Eye, label: 'Meus anúncios', meta: String(myAdsCount), action: onOpenMyAds },
    { icon: Shield, label: 'Moderação', meta: '', action: onOpenModeration },
    { icon: MessageCircle, label: 'Conversas', meta: '', action: onGoToChat },
    { icon: Settings, label: 'Preferências', meta: '', action: onOpenSettings },
  ];

  return (
    <div className="px-5 safe-top pt-4 pb-32">
      {/* Identity card */}
      <header className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'var(--color-ink)', color: 'var(--color-paper)', boxShadow: '0 0 0 3px var(--color-paper), 0 0 0 4px rgba(26,22,18,0.1)' }}>
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-2xl">{initials}</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="serif-display text-2xl leading-tight" style={{ color: 'var(--color-ink)' }}>{user?.name}</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)' }}>
              {user?.neighborhood} · {user?.city}/{user?.state}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <Star size={14} className="fill-current" style={{ color: 'var(--color-amber)' }} />
              <span className="numeral text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{user?.rating?.toFixed(1)}</span>
              <span className="text-xs" style={{ color: 'var(--color-ink-4)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{user?.totalRatings} aval.</span>
            </div>
          </div>
        </div>

        {user?.description && (
          <div className="p-4 rounded-2xl" style={{ background: 'var(--color-paper-2)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>"{user.description}"</p>
          </div>
        )}
      </header>

      {/* Quick tip */}
      <div className="alert-card alert-warning mb-6">
        <span className="text-sm">💡</span>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
          Ao entregar ou receber, leia o QR Code. O anúncio é encerrado automaticamente.
        </p>
      </div>

      {/* Menu */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-0.5 rounded-full" style={{ background: 'var(--color-rust)' }} />
          <span className="kicker" style={{ fontSize: '11px' }}>Acessos rápidos</span>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-paper-2)' }}>
          {menuItems.map((item, idx) => (
            <button key={idx} onClick={item.action} className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors" style={{ borderBottom: idx < menuItems.length - 1 ? '1px solid rgba(26,22,18,0.06)' : 'none' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: item.accent === 'rust' ? 'var(--color-rust-bg)' : 'var(--color-paper)' }}>
                <item.icon size={18} strokeWidth={1.5} style={{ color: item.accent === 'rust' ? 'var(--color-rust)' : 'var(--color-ink-3)' }} />
              </div>
              <span className="flex-1 text-base" style={{ color: 'var(--color-ink)' }}>{item.label}</span>
              {item.meta && <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--color-paper)', color: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{item.meta}</span>}
              <ChevronRight size={16} style={{ color: 'var(--color-ink-4)' }} />
            </button>
          ))}
        </div>
      </section>

      {/* Logout */}
      <button onClick={onLogout} className="w-full mt-4 py-4 text-center rounded-2xl text-sm font-medium" style={{ color: 'var(--color-rust)', background: 'var(--color-rust-bg)' }}>
        <span className="inline-flex items-center gap-2"><LogOut size={16} strokeWidth={1.5} /> Encerrar sessão</span>
      </button>

      <footer className="mt-8 text-center">
        <span className="text-xs" style={{ color: 'var(--color-ink-4)' }}>Óculos Solidários · v1.0</span>
      </footer>
    </div>
  );
}
