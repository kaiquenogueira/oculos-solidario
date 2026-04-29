import { motion } from 'motion/react';

interface ModalReportProps { show: boolean; onClose: () => void; reason: string; setReason: (r: string) => void; onSubmit: () => void; }

export function ModalReport({ show, onClose, reason, setReason, onSubmit }: ModalReportProps) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 z-[70] flex items-end justify-center" style={{ background: 'rgba(24,20,15,0.5)' }} onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="w-full rounded-t-3xl p-6 safe-bottom" style={{ background: 'var(--color-paper)' }}>
        <div className="drag-indicator mb-6" />
        <h3 className="serif-display text-2xl text-center" style={{ color: 'var(--color-ink)' }}>Denunciar conteúdo</h3>
        <p className="text-sm text-center mt-2 mb-5" style={{ color: 'var(--color-ink-3)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>Descreva o motivo da denúncia.</p>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo da denúncia…" className="field-paper w-full" />
        <button onClick={onSubmit} className="btn-rust w-full mt-4">Enviar denúncia →</button>
        <button onClick={onClose} className="btn-ghost w-full mt-2">Cancelar</button>
      </motion.div>
    </div>
  );
}
