import { Star, ScanLine, Eye, Shield, MessageCircle, Settings, LogOut, ArrowUpRight } from 'lucide-react';
import { User, Ad } from '../store/useStore';

interface TabProfileProps {
  user: User | null;
  ads: Ad[];
  onOpenScanner: () => void;
  onOpenMyAds: () => void;
  onOpenModeration: () => void;
  onGoToChat: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function TabProfile({
  user, ads, onOpenScanner, onOpenMyAds, onOpenModeration, onGoToChat, onOpenSettings, onLogout
}: TabProfileProps) {
  const myAdsCount = ads.filter(ad => ad.userId === user?.id).length;
  const initials = (user?.name || 'U')
    .split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();

  const menuItems = [
    { icon: ScanLine,       label: 'Escanear entrega',  meta: 'qr',     action: onOpenScanner,    accent: 'rust' as const },
    { icon: Eye,            label: 'Meus anúncios',     meta: String(myAdsCount).padStart(2, '0'), action: onOpenMyAds },
    { icon: Shield,         label: 'Moderação',         meta: 'admin',  action: onOpenModeration, accent: 'cobalt' as const },
    { icon: MessageCircle,  label: 'Conversas',         meta: '04',     action: onGoToChat },
    { icon: Settings,       label: 'Preferências',      meta: '',       action: onOpenSettings },
    { icon: LogOut,         label: 'Encerrar sessão',   meta: '',       action: onLogout, accent: 'danger' as const },
  ];

  const accentColor = (a?: 'rust' | 'cobalt' | 'danger') => {
    if (a === 'rust') return 'var(--color-rust)';
    if (a === 'cobalt') return 'var(--color-cobalt)';
    if (a === 'danger') return 'var(--color-rust-deep)';
    return 'var(--color-ink)';
  };

  return (
    <div className="px-6 pt-10 pb-28">
      {/* Identity card — eye chart aesthetic */}
      <header className="mb-2">
        <div className="flex items-baseline justify-between mb-3">
          <span className="kicker">Identidade · perfil</span>
          <span className="numeral text-[10px]" style={{ color: 'var(--color-ink-4)' }}>
            #{user?.id?.slice(0, 6).toUpperCase() || '——'}
          </span>
        </div>

        <div className="grain-overlay relative p-6 hairline" style={{ background: 'var(--color-paper-2)' }}>
          <div className="flex items-start gap-5 relative z-10">
            <div
              className="optical-ring shrink-0 w-20 h-20 flex items-center justify-center"
              style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
            >
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-3xl">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="serif-display text-[28px] leading-tight" style={{ color: 'var(--color-ink)' }}>
                {user?.name}
              </h1>
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase mt-1" style={{ color: 'var(--color-ink-3)' }}>
                {user?.neighborhood} · {user?.city}/{user?.state}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1">
                  <Star size={12} className="fill-current" style={{ color: 'var(--color-amber)' }} />
                  <span className="numeral text-[13px]" style={{ color: 'var(--color-ink)' }}>{user?.rating?.toFixed(1)}</span>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--color-ink-4)' }}>
                    /5 · {user?.totalRatings} aval.
                  </span>
                </span>
              </div>
            </div>
          </div>

          {user?.description && (
            <>
              <div className="rule my-4 relative z-10"></div>
              <p className="font-display italic text-[14px] leading-relaxed relative z-10" style={{ color: 'var(--color-ink-2)' }}>
                "{user.description}"
              </p>
            </>
          )}
        </div>
      </header>

      <div className="rule-double my-7"></div>

      {/* Tip strip */}
      <div className="mb-6 px-4 py-3 flex items-start gap-3 relative" style={{ background: 'var(--color-amber)', color: 'var(--color-ink)' }}>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase shrink-0" style={{ color: 'var(--color-rust-deep)' }}>nota</span>
        <p className="font-display italic text-[13px] leading-snug">
          Ao entregar ou receber, leia o QR Code. O anúncio é encerrado automaticamente.
        </p>
      </div>

      {/* Menu */}
      <section>
        <div className="flex items-baseline gap-3 mb-3">
          <span className="numeral text-[11px]" style={{ color: 'var(--color-rust)' }}>§ 02</span>
          <span className="kicker">Acessos rápidos</span>
        </div>

        <ul>
          {menuItems.map((item, idx) => {
            const color = accentColor(item.accent);
            return (
              <li key={idx}>
                <button
                  onClick={item.action}
                  className="w-full grid grid-cols-[24px_1fr_auto_auto] items-center gap-4 py-4 group transition-colors hover:bg-[var(--color-paper-2)]"
                  style={{ borderBottom: '1px solid rgba(26,22,18,0.12)' }}
                >
                  <span className="numeral text-[10px]" style={{ color: 'var(--color-ink-4)' }}>
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className="flex items-center gap-3 text-left">
                    <item.icon size={16} strokeWidth={1.5} style={{ color }} />
                    <span className="font-display text-[17px]" style={{ color }}>
                      {item.label}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--color-ink-4)' }}>
                    {item.meta}
                  </span>
                  <ArrowUpRight size={14} strokeWidth={1.5} style={{ color: 'var(--color-ink-3)' }} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Colofon */}
      <footer className="mt-10 pt-4">
        <div className="rule mb-4"></div>
        <div className="flex items-center justify-between">
          <span className="kicker">Óculos Solidários — ed. 01</span>
          <span className="numeral text-[10px]" style={{ color: 'var(--color-ink-4)' }}>p. ∞</span>
        </div>
      </footer>
    </div>
  );
}
