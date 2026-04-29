import { motion } from 'motion/react';

interface ModalQRCodeProps { show: boolean; onClose: () => void; value: string; title: string; description: string; }

export function ModalQRCode({ show, onClose, value, title, description }: ModalQRCodeProps) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 z-[70] flex items-end justify-center" style={{ background: 'rgba(24,20,15,0.5)' }} onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 220 }} onClick={(e) => e.stopPropagation()} className="w-full rounded-t-3xl p-6 safe-bottom" style={{ background: 'var(--color-paper)' }}>
        <div className="drag-indicator mb-6" />
        <h3 className="serif-display text-2xl text-center" style={{ color: 'var(--color-ink)' }}>{title}</h3>
        <p className="text-sm text-center mt-2" style={{ color: 'var(--color-ink-3)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{description}</p>
        <div className="mt-6 mb-4 flex justify-center">
          <div className="w-48 h-48 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-paper-2)', border: '1px solid rgba(26,22,18,0.08)' }}>
            <span className="font-mono text-xs text-center" style={{ color: 'var(--color-ink-4)' }}>QR: {value.slice(0, 8)}…</span>
          </div>
        </div>
        <button onClick={onClose} className="btn-ghost w-full mt-2">Fechar</button>
      </motion.div>
    </div>
  );
}
