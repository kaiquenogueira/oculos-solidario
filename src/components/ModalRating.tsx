import { Star } from 'lucide-react';
import { motion } from 'motion/react';

interface ModalRatingProps { show: boolean; onClose: () => void; rating: number; setRating: (r: number) => void; comment: string; setComment: (c: string) => void; onSubmit: () => void; }

export function ModalRating({ show, onClose, rating, setRating, comment, setComment, onSubmit }: ModalRatingProps) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 z-[70] flex items-end justify-center" style={{ background: 'rgba(24,20,15,0.5)' }} onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="w-full rounded-t-3xl p-6 safe-bottom" style={{ background: 'var(--color-paper)' }}>
        <div className="drag-indicator mb-6" />
        <h3 className="serif-display text-2xl text-center" style={{ color: 'var(--color-ink)' }}>Como foi a experiência?</h3>
        <div className="flex justify-center gap-3 mt-5">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setRating(n)} className="w-12 h-12 rounded-full flex items-center justify-center transition-all" style={{ background: n <= rating ? 'var(--color-amber-bg)' : 'var(--color-paper-2)' }}>
              <Star size={22} className={n <= rating ? 'fill-current' : ''} style={{ color: n <= rating ? 'var(--color-amber)' : 'var(--color-ink-4)' }} />
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comentário opcional…" className="field-paper w-full mt-5" />
        <button onClick={onSubmit} className="btn-ink w-full mt-4">Enviar avaliação →</button>
      </motion.div>
    </div>
  );
}
