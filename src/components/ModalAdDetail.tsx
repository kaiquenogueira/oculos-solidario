import { X, Star, ArrowUpRight, QrCode, CheckCircle2, MessageCircle, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Ad } from '../store/useStore';

interface ModalAdDetailProps {
  ad: Ad | null;
  onClose: () => void;
  activePhotoIndex: number;
  setActivePhotoIndex: (index: number) => void;
  onGenerateQRCode: () => void;
  onCompleteAd: (id: string) => void;
  onManifestInterest: (ad: Ad) => void;
}

export function ModalAdDetail({
  ad, onClose, activePhotoIndex, setActivePhotoIndex,
  onGenerateQRCode, onCompleteAd, onManifestInterest
}: ModalAdDetailProps) {
  if (!ad) return null;
  const photos = ad.photoUrls || [ad.photoUrl];

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="absolute inset-0 z-50 flex flex-col paper-grain"
      style={{ background: 'var(--color-paper)' }}
    >
      {/* Photo carousel */}
      <div className="relative h-80 overflow-hidden" style={{ background: 'var(--color-ink)' }}>
        <div
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
          onScroll={(e) => {
            const idx = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
            setActivePhotoIndex(idx);
          }}
        >
          {photos.map((url, i) => (
            <div key={i} className="min-w-full h-full snap-center relative">
              <img src={url} className="w-full h-full object-cover" alt="" />
              <span className="absolute bottom-4 left-4 numeral text-[10px] px-2 py-1" style={{ background: 'var(--color-paper)', color: 'var(--color-ink)' }}>
                fig. {String(i + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1.5">
            {photos.map((_, i) => (
              <span
                key={i}
                className="h-px transition-all duration-300"
                style={{
                  width: activePhotoIndex === i ? 22 : 12,
                  background: activePhotoIndex === i ? 'var(--color-paper)' : 'rgba(245,239,228,0.4)',
                }}
              />
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-10 left-4 w-10 h-10 flex items-center justify-center"
          style={{ background: 'var(--color-paper)', color: 'var(--color-ink)' }}
          aria-label="Fechar"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <span
          className="absolute top-10 right-4 tag-mono"
          style={ad.type === 'donation'
            ? { background: 'var(--color-rust)', color: 'var(--color-paper)', borderColor: 'var(--color-rust)' }
            : { background: 'var(--color-paper)' }
          }
        >
          {ad.type === 'donation' ? '◆ doação' : '◇ troca'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 relative z-10">
        <div className="flex items-baseline justify-between mb-2">
          <span className="kicker kicker-rust">Peça em destaque</span>
          <span className="numeral text-[10px]" style={{ color: 'var(--color-ink-4)' }}>
            #{ad.id.slice(0, 6).toUpperCase()}
          </span>
        </div>

        <h2 className="serif-display text-[36px] leading-[0.95]" style={{ color: 'var(--color-ink)' }}>
          {ad.title}
        </h2>

        <div className="flex items-center gap-3 mt-2">
          <span className="kicker flex items-center gap-1">
            <MapPin size={10} strokeWidth={1.5} />
            {ad.neighborhood}, {ad.city}
          </span>
        </div>

        <div className="rule-double my-5"></div>

        {/* Spec table */}
        <dl className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
          <div>
            <dt className="kicker mb-1">Grau resumido</dt>
            <dd className="font-mono text-[15px]" style={{ color: 'var(--color-rust)' }}>
              {ad.prescriptionSummary || '—'}
            </dd>
          </div>
          <div>
            <dt className="kicker mb-1">Público</dt>
            <dd className="font-display text-[16px] capitalize" style={{ color: 'var(--color-ink)' }}>
              {ad.targetAudience === 'adult' ? 'Adulto' : ad.targetAudience === 'child' ? 'Infantil' : 'Unissex'}
            </dd>
          </div>
          <div>
            <dt className="kicker mb-1">Estado</dt>
            <dd className="font-display text-[16px]" style={{ color: 'var(--color-ink)' }}>
              {ad.condition || '—'}
            </dd>
          </div>
          <div>
            <dt className="kicker mb-1">Modelo</dt>
            <dd className="font-display text-[16px]" style={{ color: 'var(--color-ink)' }}>
              {ad.frameStyle || '—'}
            </dd>
          </div>
        </dl>

        <div className="rule mb-5"></div>

        <span className="kicker block mb-2">Notas do anunciante</span>
        <p className="font-display text-[16px] leading-relaxed mb-6" style={{ color: 'var(--color-ink-2)' }}>
          {ad.description}
        </p>

        <div className="rule mb-5"></div>

        {/* Owner */}
        <div className="flex items-center gap-4 py-2">
          <div
            className="w-12 h-12 hairline-strong flex items-center justify-center"
            style={{ background: 'var(--color-paper-2)' }}
          >
            <span className="font-display text-lg" style={{ color: 'var(--color-ink)' }}>
              {ad.userId.slice(0, 1).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <span className="kicker">Anunciante</span>
            <p className="font-display text-[17px] leading-tight mt-0.5" style={{ color: 'var(--color-ink)' }}>
              Doador #{ad.userId.slice(-4).toUpperCase()}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={10} className="fill-current" style={{ color: 'var(--color-amber)' }} />
              <span className="numeral text-[11px]" style={{ color: 'var(--color-ink-3)' }}>4.5 · 8 aval.</span>
            </div>
          </div>
          <ArrowUpRight size={16} strokeWidth={1.5} style={{ color: 'var(--color-ink-3)' }} />
        </div>
      </div>

      {/* Actions */}
      <div
        className="px-6 py-5 space-y-3"
        style={{ background: 'var(--color-paper)', borderTop: '1px solid rgba(26,22,18,0.18)' }}
      >
        <button onClick={() => onManifestInterest(ad)} className="btn-ink w-full">
          <MessageCircle size={14} strokeWidth={1.8} />
          Manifestar interesse
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onGenerateQRCode} className="btn-rust">
            <QrCode size={14} strokeWidth={1.8} />
            QR retirada
          </button>
          <button onClick={() => onCompleteAd(ad.id)} className="btn-sage">
            <CheckCircle2 size={14} strokeWidth={1.8} />
            Finalizar
          </button>
        </div>
        <p className="kicker text-center" style={{ color: 'var(--color-ink-4)' }}>
          QR válido por 24h · entregue em mãos
        </p>
      </div>
    </motion.div>
  );
}
