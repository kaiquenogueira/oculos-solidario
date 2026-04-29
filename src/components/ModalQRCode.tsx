import { X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface ModalQRCodeProps {
  show: boolean;
  onClose: () => void;
  value: string;
  title: string;
  description: string;
}

export function ModalQRCode({ show, onClose, value, title, description }: ModalQRCodeProps) {
  if (!show) return null;

  return (
    <div
      className="absolute inset-0 z-[70] flex items-center justify-center p-6"
      style={{ background: 'rgba(26,22,18,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-sm relative paper-grain hairline-strong p-7"
        style={{ background: 'var(--color-paper)' }}
      >
        <div className="flex items-baseline justify-between mb-4 relative z-10">
          <span className="kicker kicker-rust">— ticket de retirada —</span>
          <button onClick={onClose} aria-label="Fechar">
            <X size={16} strokeWidth={1.5} style={{ color: 'var(--color-ink)' }} />
          </button>
        </div>

        <h3 className="serif-display text-[28px] mb-2 relative z-10" style={{ color: 'var(--color-ink)' }}>
          {title}
        </h3>
        <div className="rule-double mb-5 relative z-10"></div>

        <div className="flex justify-center mb-5 relative z-10">
          <div className="p-4 hairline-strong" style={{ background: 'var(--color-paper)' }}>
            <QRCodeCanvas value={value} size={196} fgColor="#1A1612" bgColor="#F5EFE4" />
          </div>
        </div>

        <p className="font-display italic text-center text-[15px] leading-snug mb-2 relative z-10" style={{ color: 'var(--color-ink-2)' }}>
          {description}
        </p>
        <p className="kicker text-center mb-6 relative z-10">— válido por 24 horas —</p>

        <button onClick={onClose} className="btn-ghost w-full relative z-10">
          Fechar
        </button>
      </div>
    </div>
  );
}
