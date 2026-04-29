import { AlertTriangle } from 'lucide-react';

interface ModalReportProps {
  show: boolean;
  onClose: () => void;
  reason: string;
  setReason: (r: string) => void;
  onSubmit: () => void;
}

const reasons = [
  { value: 'not_glasses', label: 'Não é óculos de grau' },
  { value: 'spam',        label: 'Spam ou propaganda' },
  { value: 'offensive',   label: 'Conteúdo ofensivo' },
  { value: 'fraud',       label: 'Suspeita de fraude' },
];

export function ModalReport({ show, onClose, reason, setReason, onSubmit }: ModalReportProps) {
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
        <div className="flex items-center gap-3 mb-1 relative z-10">
          <AlertTriangle size={20} strokeWidth={1.5} style={{ color: 'var(--color-rust)' }} />
          <span className="kicker kicker-rust">— denúncia editorial —</span>
        </div>
        <h3 className="serif-display text-[28px] mt-2 relative z-10" style={{ color: 'var(--color-ink)' }}>
          Reportar este <span className="italic">anúncio</span>
        </h3>
        <p className="font-display italic text-[14px] mt-1 mb-5 relative z-10" style={{ color: 'var(--color-ink-3)' }}>
          Selecione o motivo. Sua identidade não será revelada.
        </p>
        <div className="rule-double mb-5 relative z-10"></div>

        <div className="space-y-2 mb-6 relative z-10">
          {reasons.map((r) => {
            const active = reason === r.value;
            return (
              <button
                key={r.value}
                onClick={() => setReason(r.value)}
                className="w-full text-left px-4 py-3 hairline transition-colors flex items-center gap-3"
                style={{
                  background: active ? 'var(--color-ink)' : 'var(--color-paper)',
                  color: active ? 'var(--color-paper)' : 'var(--color-ink)',
                  borderColor: active ? 'var(--color-ink)' : undefined,
                }}
              >
                <span className="numeral text-[10px] opacity-60">{active ? '◆' : '◇'}</span>
                <span className="font-display text-[15px]">{r.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 relative z-10">
          <button onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
          <button onClick={onSubmit} disabled={!reason} className="btn-rust flex-1">Denunciar</button>
        </div>
      </div>
    </div>
  );
}
