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
  show, 
  onClose, 
  ads, 
  prescriptionRequests, 
  onCompleteAd, 
  onCompletePrescription 
}: ModalScannerProps) {
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (show) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      
      scanner.render((decodedText) => {
        if (decodedText) {
          scanner?.clear();
          
          if (ads.find(a => a.id === decodedText)) {
            onCompleteAd(decodedText);
            alert('Retirada confirmada! O anúncio foi removido automaticamente.');
          } else if (prescriptionRequests.find(r => r.id === decodedText)) {
            onCompletePrescription(decodedText);
            alert('Entrega de óculos novos confirmada! Obrigado por sua solidariedade.');
          } else {
            alert('QR Code inválido ou não encontrado.');
          }
          
          onClose();
        }
      }, (error) => {
        // ignore errors
      });
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error("Scanner cleanup failed", e));
      }
    };
  }, [show, ads, prescriptionRequests, onCompleteAd, onCompletePrescription, onClose]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-slate-800">Escanear QR Code</h3>
          <button onClick={onClose} className="text-slate-400">
            <X size={24} />
          </button>
        </div>
        
        <div className="bg-slate-100 rounded-2xl overflow-hidden aspect-square relative" id="qr-reader">
           {/* Scanner will render here */}
        </div>

        <p className="text-xs text-slate-400 px-4">
          Aponte a câmera para o QR Code no celular da outra pessoa para confirmar a transação.
        </p>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
