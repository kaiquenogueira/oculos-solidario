import { Star } from 'lucide-react';

interface ModalRatingProps {
  show: boolean;
  onClose: () => void;
  rating: number;
  setRating: (v: number) => void;
  comment: string;
  setComment: (c: string) => void;
  onSubmit: () => void;
}

export function ModalRating({ show, onClose, rating, setRating, comment, setComment, onSubmit }: ModalRatingProps) {
  if (!show) return null;

  return (
    <div
      className="absolute inset-0 z-[80] flex items-center justify-center p-6"
      style={{ background: 'rgba(26,22,18,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-sm relative paper-grain hairline-strong p-7"
        style={{ background: 'var(--color-paper)' }}
      >
        <span className="kicker kicker-rust block mb-2 relative z-10">— diário de avaliação —</span>
        <h3 className="serif-display text-[28px] mb-1 relative z-10" style={{ color: 'var(--color-ink)' }}>
          Como foi a <span className="italic">troca</span>?
        </h3>
        <p className="font-display italic text-[14px] mb-5 relative z-10" style={{ color: 'var(--color-ink-3)' }}>
          Sua nota ajuda a manter a curadoria honesta.
        </p>
        <div className="rule-double mb-5 relative z-10"></div>

        <div className="flex justify-center gap-2 mb-5 relative z-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="transition-transform active:scale-90">
              <Star
                size={28}
                strokeWidth={1.4}
                className={star <= rating ? 'fill-current' : ''}
                style={{ color: star <= rating ? 'var(--color-amber)' : 'var(--color-ink-4)' }}
              />
            </button>
          ))}
        </div>

        <span className="kicker block mb-2 relative z-10">— comentário —</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="(opcional) deixe um recado…"
          className="field-paper w-full h-20 resize-none mb-5 relative z-10"
        />

        <div className="flex gap-3 relative z-10">
          <button onClick={onClose} className="btn-ghost flex-1">Pular</button>
          <button onClick={onSubmit} className="btn-rust flex-1">Enviar</button>
        </div>
      </div>
    </div>
  );
}
