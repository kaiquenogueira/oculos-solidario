import { Bell, MapPin, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { User as UserType, Ad } from '../store/useStore';

interface TabHomeProps {
  user: UserType | null;
  ads: Ad[];
  onSelectAd: (ad: Ad) => void;
  onOpenNotifications: () => void;
  onOpenMap: () => void;
}

export function TabHome({ user, ads, onSelectAd, onOpenNotifications, onOpenMap }: TabHomeProps) {
  const activeAds = ads.filter(ad => ad.status === 'active');
  const featured = activeAds[0];
  const rest = activeAds.slice(1);
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="pb-32 safe-top pt-4">
      {/* Masthead */}
      <header className="px-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="kicker">{today}</span>
            <h1
              className="serif-display mt-1.5"
              style={{ fontSize: '36px', color: 'var(--color-ink)', lineHeight: 0.95 }}
            >
              Olá, <span className="italic" style={{ color: 'var(--color-rust)' }}>{user?.name.split(' ')[0]}</span>.
            </h1>
          </div>
          <button
            onClick={onOpenNotifications}
            className="w-11 h-11 flex items-center justify-center relative rounded-full"
            style={{ background: 'var(--color-paper-2)' }}
            aria-label="Notificações"
          >
            <Bell size={18} style={{ color: 'var(--color-ink)' }} strokeWidth={1.6} />
            <span
              className="absolute top-2 right-2.5 w-2 h-2 rounded-full"
              style={{ background: 'var(--color-rust)', boxShadow: '0 0 0 2px var(--color-paper)' }}
            />
          </button>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-3)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
          Hoje há {activeAds.length} {activeAds.length === 1 ? 'armação à espera' : 'armações à espera'} de novos olhos.
        </p>
      </header>

      {/* Quick stats */}
      <div className="flex gap-3 px-5 mb-6">
        <div
          className="flex-1 p-4 rounded-2xl"
          style={{ background: 'var(--color-rust-bg)' }}
        >
          <span className="eye-mark text-3xl" style={{ color: 'var(--color-rust)' }}>{activeAds.filter(a => a.type === 'donation').length}</span>
          <p className="kicker mt-1 text-xs" style={{ color: 'var(--color-rust)', fontSize: '10px' }}>Doações</p>
        </div>
        <div
          className="flex-1 p-4 rounded-2xl"
          style={{ background: 'var(--color-sage-bg)' }}
        >
          <span className="eye-mark text-3xl" style={{ color: 'var(--color-sage)' }}>{activeAds.filter(a => a.type === 'exchange').length}</span>
          <p className="kicker mt-1 text-xs" style={{ color: 'var(--color-sage)', fontSize: '10px' }}>Trocas</p>
        </div>
        <button
          onClick={onOpenMap}
          className="flex-1 p-4 rounded-2xl flex flex-col items-center justify-center"
          style={{ background: 'var(--color-paper-2)' }}
        >
          <MapPin size={22} strokeWidth={1.5} style={{ color: 'var(--color-ink-3)' }} />
          <p className="kicker mt-1 text-xs" style={{ fontSize: '10px' }}>Ver mapa</p>
        </button>
      </div>

      {/* Editorial tip card with image */}
      <section className="px-5 mb-8">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ background: 'var(--color-ink)' }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img src="/images/child-vision.png" alt="" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(24,20,15,0.3) 0%, rgba(24,20,15,0.85) 100%)' }} />
          </div>

          <div className="relative z-10 p-5 pt-28" style={{ color: 'var(--color-paper)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-0.5 rounded-full" style={{ background: 'var(--color-rust-soft)' }} />
              <span className="kicker" style={{ color: 'var(--color-paper-3)', opacity: 0.7, fontSize: '10px' }}>Coluna · Cuidado com a vista</span>
            </div>
            <p
              className="font-display text-xl leading-snug"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1' }}
            >
              "Antes de trocar as <span className="italic" style={{ color: 'var(--color-rust-soft)' }}>lentes</span>, troque o <span className="italic">exame</span>."
            </p>
            <button
              className="mt-4 inline-flex items-center gap-2 text-xs tracking-wider uppercase py-2.5 px-4 rounded-full"
              style={{
                background: 'rgba(245,239,228,0.15)',
                color: 'var(--color-rust-soft)',
                fontFamily: 'var(--font-mono)',
                backdropFilter: 'blur(4px)',
              }}
            >
              Ler mais →
            </button>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="px-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 rounded-full" style={{ background: 'var(--color-rust)' }} />
            <span className="kicker">Em destaque</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectAd(featured)}
            className="w-full text-left group card-paper"
          >
            <div className="aspect-[16/10] overflow-hidden relative rounded-t-[20px]">
              <img src={featured.photoUrl} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute top-3 left-3">
                <span className={`tag-mono ${featured.type === 'donation' ? 'tag-rust' : ''}`}>
                  {featured.type === 'donation' ? '◆ Doação' : '◇ Troca'}
                </span>
              </div>
              {/* Gradient overlay for readability */}
              <div
                className="absolute bottom-0 left-0 right-0 h-20"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl leading-tight flex-1" style={{ color: 'var(--color-ink)' }}>
                  {featured.title}
                </h3>
                <ArrowUpRight size={18} strokeWidth={1.6} style={{ color: 'var(--color-ink-3)' }} className="shrink-0 mt-1" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <MapPin size={12} strokeWidth={1.5} style={{ color: 'var(--color-ink-4)' }} />
                <span className="text-xs" style={{ color: 'var(--color-ink-3)' }}>
                  {featured.neighborhood}, {featured.city}
                </span>
                {featured.prescriptionSummary && (
                  <>
                    <span style={{ color: 'var(--color-ink-4)' }}>·</span>
                    <span className="font-mono text-xs" style={{ color: 'var(--color-ink-4)' }}>
                      {featured.prescriptionSummary}
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.button>
        </section>
      )}

      {/* Catalogue grid */}
      <section className="px-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 rounded-full" style={{ background: 'var(--color-rust)' }} />
            <span className="kicker">Catálogo</span>
          </div>
          <button
            onClick={onOpenMap}
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              color: 'var(--color-rust)',
              background: 'var(--color-rust-bg)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
            }}
          >
            Ver mapa →
          </button>
        </div>

        {rest.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--color-paper-2)' }}>
            <span className="eye-mark text-4xl" style={{ color: 'var(--color-ink-4)' }}>—∅—</span>
            <p className="font-display italic mt-3 text-sm" style={{ color: 'var(--color-ink-3)' }}>
              Nenhum item por aqui ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {rest.map((ad) => (
              <motion.button
                key={ad.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectAd(ad)}
                className="text-left group card-paper"
              >
                <div className="aspect-square overflow-hidden relative rounded-t-[20px]" style={{ background: 'var(--color-paper-2)' }}>
                  <img src={ad.photoUrl} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span
                    className={`absolute top-2 left-2 tag-mono ${ad.type === 'donation' ? 'tag-rust' : ''}`}
                    style={{ fontSize: '9px', padding: '3px 8px' }}
                  >
                    {ad.type === 'donation' ? '◆ doação' : '◇ troca'}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-display text-sm leading-tight line-clamp-2" style={{ color: 'var(--color-ink)' }}>
                    {ad.title}
                  </h4>
                  <div className="flex items-center mt-1.5 gap-1">
                    <MapPin size={10} strokeWidth={1.5} style={{ color: 'var(--color-ink-4)' }} />
                    <span className="text-xs truncate" style={{ color: 'var(--color-ink-4)' }}>{ad.neighborhood}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
