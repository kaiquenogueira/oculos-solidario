import { X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ad } from '../store/useStore';

interface MapOverlayProps { show: boolean; onClose: () => void; ads: Ad[]; onSelectAd: (ad: Ad) => void; }

export function MapOverlay({ show, onClose, ads, onSelectAd }: MapOverlayProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] flex flex-col" style={{ background: 'var(--color-paper)' }}>
        {/* Top bar */}
        <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 safe-top pt-3 pb-4" style={{ background: 'linear-gradient(180deg, rgba(250,246,240,0.95) 0%, rgba(250,246,240,0) 100%)' }}>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: 'var(--color-paper)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} aria-label="Fechar">
            <X size={16} strokeWidth={2} style={{ color: 'var(--color-ink)' }} />
          </button>
          <div className="text-center">
            <span className="kicker block" style={{ fontSize: '10px' }}>Cartografia</span>
            <span className="font-display text-sm" style={{ color: 'var(--color-ink)' }}><span className="numeral">{ads.length}</span> peças na região</span>
          </div>
          <div className="w-10" />
        </header>

        {/* Map placeholder */}
        <div className="flex-1 relative overflow-hidden" style={{ background: 'var(--color-paper-3)' }}>
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" className="w-full h-full object-cover" style={{ filter: 'sepia(0.4) contrast(0.85) brightness(1.05) saturate(0.6)', opacity: 0.55 }} alt="" />
          {ads.slice(0, 5).map((ad, i) => (
            <button key={ad.id} className="absolute group" style={{ top: `${22 + i * 13}%`, left: `${20 + i * 12}%` }} onClick={() => onSelectAd(ad)}>
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg" style={{ border: '2px solid var(--color-paper)' }}>
                <img src={ad.photoUrl} className="w-full h-full object-cover" alt="" />
              </div>
            </button>
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-10 h-10 absolute inset-0 rounded-full" style={{ background: 'var(--color-rust)', opacity: 0.2, animation: 'pulse-ring 2s ease-out infinite' }} />
              <div className="w-3.5 h-3.5 rounded-full relative" style={{ background: 'var(--color-rust)', boxShadow: '0 0 0 3px var(--color-paper), 0 0 0 4px var(--color-ink)', marginTop: 13, marginLeft: 13 }} />
            </div>
          </div>
        </div>

        {/* Bottom carousel */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 safe-bottom rounded-t-3xl" style={{ background: 'var(--color-paper)', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
          <span className="kicker block mb-2" style={{ fontSize: '11px' }}>Peças próximas</span>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {ads.filter(a => a.status === 'active').slice(0, 4).map((ad) => (
              <button key={ad.id} onClick={() => onSelectAd(ad)} className="shrink-0 w-60 p-3 flex gap-3 text-left rounded-xl" style={{ background: 'var(--color-paper-2)', border: '1px solid rgba(26,22,18,0.06)' }}>
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0"><img src={ad.photoUrl} className="w-full h-full object-cover" alt="" /></div>
                <div className="flex-1 min-w-0">
                  <span className={`tag-mono ${ad.type === 'donation' ? 'tag-rust' : ''}`} style={{ fontSize: '8px', padding: '2px 6px' }}>{ad.type === 'donation' ? '◆ doação' : '◇ troca'}</span>
                  <h4 className="font-display text-sm leading-tight truncate mt-1" style={{ color: 'var(--color-ink)' }}>{ad.title}</h4>
                  <span className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: 'var(--color-ink-4)' }}><MapPin size={10} strokeWidth={1.5} />{ad.neighborhood}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
