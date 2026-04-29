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
    <div className="pb-28 pt-10">
      {/* Masthead */}
      <header className="px-6 pb-3">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="kicker">{today}</span>
            <h1
              className="serif-display mt-1"
              style={{ fontSize: '40px', color: 'var(--color-ink)', lineHeight: 0.95 }}
            >
              Olá, <span className="italic" style={{ color: 'var(--color-rust)' }}>{user?.name.split(' ')[0]}</span>.
            </h1>
          </div>
          <button
            onClick={onOpenNotifications}
            className="hairline w-10 h-10 flex items-center justify-center relative"
            style={{ background: 'var(--color-paper)' }}
            aria-label="Notificações"
          >
            <Bell size={16} style={{ color: 'var(--color-ink)' }} strokeWidth={1.5} />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--color-rust)' }}
            />
          </button>
        </div>

        <p className="font-display text-base italic max-w-[80%]" style={{ color: 'var(--color-ink-3)' }}>
          Hoje há {activeAds.length} {activeAds.length === 1 ? 'armação à espera' : 'armações à espera'} de novos olhos.
        </p>
      </header>

      <div className="rule-double mx-6 my-5"></div>

      {/* Editorial — Tip of the day */}
      <section className="px-6 mb-8">
        <div className="flex items-baseline gap-3 mb-3">
          <span className="numeral text-[11px]" style={{ color: 'var(--color-rust)' }}>§ 01</span>
          <span className="kicker">Coluna · Cuidado com a vista</span>
        </div>

        <div
          className="relative overflow-hidden p-6 grain-overlay"
          style={{
            background: 'linear-gradient(135deg, var(--color-ink) 0%, #2a221b 100%)',
            color: 'var(--color-paper)',
          }}
        >
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex-1">
              <p
                className="font-display text-[26px] leading-tight"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1' }}
              >
                "Antes de trocar as <span className="italic" style={{ color: 'var(--color-rust-soft)' }}>lentes</span>, troque o <span className="italic">exame</span>."
              </p>
              <div className="flex items-center gap-2 mt-5">
                <span className="kicker" style={{ color: 'var(--color-paper-3)', opacity: 0.7 }}>— Editorial</span>
                <button
                  className="font-mono text-[10px] tracking-[0.2em] uppercase pb-0.5"
                  style={{
                    color: 'var(--color-rust-soft)',
                    borderBottom: '1px solid var(--color-rust-soft)',
                  }}
                >
                  Continuar lendo
                </button>
              </div>
            </div>
            <span className="eye-mark text-[64px] opacity-20" aria-hidden>20/20</span>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="px-6 mb-10">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="numeral text-[11px]" style={{ color: 'var(--color-rust)' }}>§ 02</span>
            <span className="kicker">Em destaque · esta semana</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectAd(featured)}
            className="w-full text-left group"
          >
            <div className="aspect-[4/3] overflow-hidden hairline relative">
              <img src={featured.photoUrl} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={featured.type === 'donation' ? 'tag-rust' : 'tag-ink'}>
                  {featured.type === 'donation' ? 'Doação' : 'Troca'}
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="tag-mono" style={{ background: 'var(--color-paper)' }}>
                  <ArrowUpRight size={11} className="inline -mt-0.5" /> ver
                </span>
              </div>
            </div>
            <div className="pt-3 flex items-baseline justify-between gap-3">
              <h3 className="font-display text-2xl leading-tight flex-1" style={{ color: 'var(--color-ink)' }}>
                {featured.title}
              </h3>
              <span className="numeral text-[11px] shrink-0" style={{ color: 'var(--color-ink-3)' }}>
                #{featured.id.slice(0, 4).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="kicker flex items-center gap-1.5">
                <MapPin size={10} strokeWidth={1.5} />
                {featured.neighborhood}, {featured.city}
              </span>
              <span className="font-mono text-[10px]" style={{ color: 'var(--color-ink-4)' }}>
                {featured.prescriptionSummary || '—'}
              </span>
            </div>
          </motion.button>
        </section>
      )}

      {/* Catalogue grid */}
      <section className="px-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="numeral text-[11px]" style={{ color: 'var(--color-rust)' }}>§ 03</span>
            <h3 className="serif-display text-[28px] mt-1" style={{ color: 'var(--color-ink)' }}>
              Catálogo das <span className="italic">redondezas</span>
            </h3>
          </div>
          <button
            onClick={onOpenMap}
            className="font-mono text-[10px] tracking-[0.2em] uppercase pb-0.5 underline-grow"
            style={{ color: 'var(--color-rust)', borderBottom: '1px solid var(--color-rust)' }}
          >
            Ver mapa →
          </button>
        </div>

        {rest.length === 0 ? (
          <div className="hairline p-10 text-center" style={{ background: 'var(--color-paper-2)' }}>
            <span className="eye-mark text-[42px]" style={{ color: 'var(--color-ink-4)' }}>—∅—</span>
            <p className="font-display italic mt-3" style={{ color: 'var(--color-ink-3)' }}>
              Nenhum item por aqui ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7">
            {rest.map((ad, i) => (
              <motion.button
                key={ad.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectAd(ad)}
                className="text-left group"
              >
                <div className="aspect-square overflow-hidden hairline relative" style={{ background: 'var(--color-paper-2)' }}>
                  <img src={ad.photoUrl} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span
                    className="absolute top-2 left-2 tag-mono"
                    style={ad.type === 'donation'
                      ? { background: 'var(--color-rust)', color: 'var(--color-paper)', borderColor: 'var(--color-rust)' }
                      : { background: 'var(--color-paper)' }
                    }
                  >
                    {ad.type === 'donation' ? '◆ doação' : '◇ troca'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-2 gap-2">
                  <span className="numeral text-[9px]" style={{ color: 'var(--color-ink-4)' }}>
                    {String(i + 2).padStart(2, '0')}.
                  </span>
                  <span className="numeral text-[9px]" style={{ color: 'var(--color-ink-4)' }}>
                    #{ad.id.slice(0, 4).toUpperCase()}
                  </span>
                </div>
                <h4 className="font-display text-[17px] leading-tight mt-0.5 line-clamp-2" style={{ color: 'var(--color-ink)' }}>
                  {ad.title}
                </h4>
                <div className="flex items-center mt-1.5 text-[10px]" style={{ color: 'var(--color-ink-3)' }}>
                  <MapPin size={9} className="mr-1" strokeWidth={1.5} />
                  <span className="truncate">{ad.neighborhood}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
