import { X, Star, QrCode, CheckCircle2, MessageCircle, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Ad } from '../store/useStore';

interface ModalAdDetailProps {
  ad: Ad | null; onClose: () => void; activePhotoIndex: number; setActivePhotoIndex: (i: number) => void;
  onGenerateQRCode: () => void; onCompleteAd: (id: string) => void; onManifestInterest: (ad: Ad) => void;
}

export function ModalAdDetail({ ad, onClose, activePhotoIndex, setActivePhotoIndex, onGenerateQRCode, onCompleteAd, onManifestInterest }: ModalAdDetailProps) {
  if (!ad) return null;
  const photos = ad.photoUrls || [ad.photoUrl];

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 220 }} className="absolute inset-0 z-50 flex flex-col" style={{ background: 'var(--color-paper)' }}>
      {/* Drag indicator */}
      <div className="drag-indicator" />

      {/* Photo carousel */}
      <div className="relative h-72 overflow-hidden mx-4 mt-3 rounded-2xl" style={{ background: 'var(--color-ink)' }}>
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full" onScroll={(e) => { const idx = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth); setActivePhotoIndex(idx); }}>
          {photos.map((url, i) => (
            <div key={i} className="min-w-full h-full snap-center relative"><img src={url} className="w-full h-full object-cover" alt="" /></div>
          ))}
        </div>
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (<span key={i} className="h-1.5 rounded-full transition-all duration-300" style={{ width: activePhotoIndex === i ? 20 : 6, background: activePhotoIndex === i ? 'var(--color-paper)' : 'rgba(255,255,255,0.4)' }} />))}
          </div>
        )}
        <button onClick={onClose} className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center rounded-full" style={{ background: 'rgba(0,0,0,0.4)', color: 'var(--color-paper)', backdropFilter: 'blur(10px)' }} aria-label="Fechar"><X size={16} strokeWidth={2} /></button>
        <span className={`absolute top-3 right-3 tag-mono ${ad.type === 'donation' ? 'tag-rust' : ''}`}>{ad.type === 'donation' ? '◆ Doação' : '◇ Troca'}</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4">
        <h2 className="serif-display text-3xl leading-tight" style={{ color: 'var(--color-ink)' }}>{ad.title}</h2>
        <div className="flex items-center gap-2 mt-2">
          <MapPin size={14} strokeWidth={1.5} style={{ color: 'var(--color-ink-4)' }} />
          <span className="text-sm" style={{ color: 'var(--color-ink-3)' }}>{ad.neighborhood}, {ad.city}</span>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          {[
            { label: 'Grau', value: ad.prescriptionSummary || '—', accent: true },
            { label: 'Público', value: ad.targetAudience === 'adult' ? 'Adulto' : ad.targetAudience === 'child' ? 'Infantil' : 'Unissex' },
            { label: 'Estado', value: ad.condition || '—' },
            { label: 'Modelo', value: ad.frameStyle || '—' },
          ].map((spec) => (
            <div key={spec.label} className="p-3 rounded-xl" style={{ background: 'var(--color-paper-2)' }}>
              <span className="kicker text-xs" style={{ fontSize: '10px' }}>{spec.label}</span>
              <p className="text-sm font-medium mt-0.5" style={{ color: spec.accent ? 'var(--color-rust)' : 'var(--color-ink)', fontFamily: spec.accent ? 'var(--font-mono)' : 'var(--font-display)' }}>{spec.value}</p>
            </div>
          ))}
        </div>

        <div className="rule my-5" />
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-display)' }}>{ad.description}</p>

        <div className="rule my-5" />
        {/* Owner */}
        <div className="flex items-center gap-3 py-2">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'var(--color-paper-3)' }}>
            <span className="font-display text-base" style={{ color: 'var(--color-ink)' }}>{ad.userId.slice(0, 1).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Doador #{ad.userId.slice(-4).toUpperCase()}</p>
            <div className="flex items-center gap-1 mt-0.5"><Star size={11} className="fill-current" style={{ color: 'var(--color-amber)' }} /><span className="text-xs" style={{ color: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>4.5 · 8 aval.</span></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 space-y-3 safe-bottom" style={{ borderTop: '1px solid rgba(26,22,18,0.08)' }}>
        <button onClick={() => onManifestInterest(ad)} className="btn-ink w-full"><MessageCircle size={16} strokeWidth={1.8} /> Manifestar interesse</button>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onGenerateQRCode} className="btn-rust"><QrCode size={14} strokeWidth={1.8} /> QR</button>
          <button onClick={() => onCompleteAd(ad.id)} className="btn-sage"><CheckCircle2 size={14} strokeWidth={1.8} /> Finalizar</button>
        </div>
      </div>
    </motion.div>
  );
}
