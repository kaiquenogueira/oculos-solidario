import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Ad, PrescriptionRequest } from '../store/useStore';

interface ModalScannerProps {
  show: boolean; onClose: () => void; ads: Ad[]; prescriptionRequests: PrescriptionRequest[];
  onCompleteAd: (id: string) => void; onCompletePrescription: (id: string) => void;
}

export function ModalScanner({ show, onClose, ads, prescriptionRequests, onCompleteAd, onCompletePrescription }: ModalScannerProps) {
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (show) {
      scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render((decodedText) => {
        if (decodedText) {
          scanner?.clear();
          if (ads.find(a => a.id === decodedText)) { onCompleteAd(decodedText); alert('Retirada confirmada!'); }
          else if (prescriptionRequests.find(r => r.id === decodedText)) { onCompletePrescription(decodedText); alert('Entrega confirmada!'); }
          else { alert('QR Code inválido.'); }
          onClose();
        }
      }, () => {});
    }
    return () => { if (scanner) scanner.clear().catch(() => {}); };
  }, [show, ads, prescriptionRequests, onCompleteAd, onCompletePrescription, onClose]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-[70] flex items-end justify-center" style={{ background: 'rgba(24,20,15,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full rounded-t-3xl p-6 safe-bottom" style={{ background: 'var(--color-paper)' }}>
        <div className="drag-indicator mb-5" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="kicker kicker-rust" style={{ fontSize: '10px' }}>Leitura de QR</span>
            <h3 className="serif-display text-2xl" style={{ color: 'var(--color-ink)' }}>Escanear <span className="italic">entrega</span></h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: 'var(--color-paper-2)' }} aria-label="Fechar">
            <X size={16} strokeWidth={2} style={{ color: 'var(--color-ink)' }} />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden aspect-square" id="qr-reader" style={{ background: 'var(--color-ink)' }} />

        <p className="text-sm text-center mt-4 mb-4 px-4" style={{ color: 'var(--color-ink-3)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
          Aponte para o QR Code da outra parte para confirmar.
        </p>

        <button onClick={onClose} className="btn-ghost w-full">Cancelar</button>
      </div>
    </div>
  );
}
