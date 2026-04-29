import { X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ad } from '../store/useStore';

interface MapOverlayProps {
  show: boolean;
  onClose: () => void;
  ads: Ad[];
  onSelectAd: (ad: Ad) => void;
}

export function MapOverlay({ show, onClose, ads, onSelectAd }: MapOverlayProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[60] flex flex-col"
        style={{ background: 'var(--color-paper)' }}
      >
        {/* Top bar */}
        <header
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-10 pb-4"
          style={{ background: 'linear-gradient(180deg, rgba(245,239,228,0.95) 0%, rgba(245,239,228,0) 100%)' }}
        >
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hairline-strong"
            style={{ background: 'var(--color-paper)' }}
            aria-label="Fechar"
          >
            <X size={16} strokeWidth={1.5} style={{ color: 'var(--color-ink)' }} />
          </button>

          <div className="text-center">
            <span className="kicker block">— cartografia —</span>
            <span className="font-display text-[15px]" style={{ color: 'var(--color-ink)' }}>
              <span className="numeral">{ads.length}</span> peças na região
            </span>
          </div>

          <div className="w-10"></div>
        </header>

        {/* Map */}
        <div className="flex-1 relative overflow-hidden grain-overlay" style={{ background: 'var(--color-paper-3)' }}>
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
            className="w-full h-full object-cover"
            style={{ filter: 'sepia(0.4) contrast(0.85) brightness(1.05) saturate(0.6)', opacity: 0.55 }}
            alt=""
          />

          {/* Pins */}
          {ads.slice(0, 5).map((ad, i) => (
            <button
              key={ad.id}
              className="absolute group"
              style={{ top: `${22 + i * 13}%`, left: `${20 + i * 12}%` }}
              onClick={() => onSelectAd(ad)}
            >
              <div
                className="w-12 h-12 hairline-strong overflow-hidden relative"
                style={{ background: 'var(--color-paper)' }}
              >
                <img src={ad.photoUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div
                className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 hairline opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'var(--color-paper)' }}
              >
                <span className="numeral text-[9px]" style={{ color: 'var(--color-ink-3)' }}>
                  N.º {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </button>
          ))}

          {/* User location */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div
                className="w-10 h-10 absolute inset-0"
                style={{
                  background: 'var(--color-rust)',
                  opacity: 0.2,
                  animation: 'pulse-ring 2s ease-out infinite',
                  borderRadius: '50%',
                }}
              />
              <div
                className="w-3 h-3 relative"
                style={{
                  background: 'var(--color-rust)',
                  boxShadow: '0 0 0 3px var(--color-paper), 0 0 0 4px var(--color-ink)',
                  marginTop: 14, marginLeft: 14,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom carousel */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-4"
          style={{ background: 'var(--color-paper)', borderTop: '1px solid rgba(26,22,18,0.18)' }}
        >
          <span className="kicker block mb-2">— Peças próximas —</span>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {ads.filter(a => a.status === 'active').slice(0, 4).map((ad, i) => (
              <button
                key={ad.id}
                onClick={() => onSelectAd(ad)}
                className="shrink-0 w-64 hairline p-3 flex gap-3 text-left"
                style={{ background: 'var(--color-paper-2)' }}
              >
                <div className="w-14 h-14 hairline-strong overflow-hidden shrink-0">
                  <img src={ad.photoUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1 mb-0.5">
                    <span className="numeral text-[9px]" style={{ color: 'var(--color-ink-4)' }}>
                      N.º {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="font-mono text-[8px] tracking-[0.18em] uppercase"
                      style={{ color: ad.type === 'donation' ? 'var(--color-rust)' : 'var(--color-ink-3)' }}
                    >
                      {ad.type === 'donation' ? '◆ doação' : '◇ troca'}
                    </span>
                  </div>
                  <h4 className="font-display text-[14px] leading-tight truncate" style={{ color: 'var(--color-ink)' }}>
                    {ad.title}
                  </h4>
                  <span className="kicker flex items-center gap-1 mt-0.5">
                    <MapPin size={9} strokeWidth={1.5} />
                    {ad.neighborhood}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
