import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Ad, PrescriptionRequest } from '../store/useStore';

interface ModalScannerProps {
  show: boolean;
  onClose: () => void;
  ads: Ad[];
  prescriptionRequests: PrescriptionRequest[];
  onCompleteAd: (id: string) => void;
  onCompletePrescription: (id: string) => void;
}

export function ModalScanner({
  show, onClose, ads, prescriptionRequests, onCompleteAd, onCompletePrescription
}: ModalScannerProps) {
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (show) {
      scanner = new Html5QrcodeScanner("qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render((decodedText) => {
        if (decodedText) {
          scanner?.clear();
          if (ads.find(a => a.id === decodedText)) {
            onCompleteAd(decodedText);
            alert('Retirada confirmada! O anúncio foi removido.');
          } else if (prescriptionRequests.find(r => r.id === decodedText)) {
            onCompletePrescription(decodedText);
            alert('Entrega das lentes confirmada! Obrigado pela solidariedade.');
          } else {
            alert('QR Code inválido ou não encontrado.');
          }
          onClose();
        }
      }, () => {});
    }
    return () => { if (scanner) scanner.clear().catch(() => {}); };
  }, [show, ads, prescriptionRequests, onCompleteAd, onCompletePrescription, onClose]);

  if (!show) return null;

  return (
    <div
      className="absolute inset-0 z-[70] flex items-center justify-center p-6"
      style={{ background: 'rgba(26,22,18,0.92)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-sm relative paper-grain hairline-strong p-6"
        style={{ background: 'var(--color-paper)' }}
      >
        <div className="flex items-baseline justify-between mb-4 relative z-10">
          <span className="kicker kicker-rust">— leitura de qr —</span>
          <button onClick={onClose} aria-label="Fechar">
            <X size={16} strokeWidth={1.5} style={{ color: 'var(--color-ink)' }} />
          </button>
        </div>

        <h3 className="serif-display text-[26px] mb-1 relative z-10" style={{ color: 'var(--color-ink)' }}>
          Escanear <span className="italic">entrega</span>
        </h3>
        <div className="rule-double mb-5 relative z-10"></div>

        <div className="hairline-strong overflow-hidden aspect-square relative z-10" id="qr-reader" style={{ background: 'var(--color-ink)' }}></div>

        <p className="font-display italic text-[13px] leading-snug text-center mt-5 mb-5 px-2 relative z-10" style={{ color: 'var(--color-ink-3)' }}>
          Aponte para o QR Code da outra parte para confirmar a transação em mãos.
        </p>

        <button onClick={onClose} className="btn-ghost w-full relative z-10">
          Cancelar leitura
        </button>
      </div>
    </div>
  );
}
