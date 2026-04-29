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
    <div className="absolute inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400">
            <X size={24} />
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-3xl shadow-inner inline-block mx-auto border-8 border-slate-50">
          <QRCodeCanvas value={value} size={200} />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold text-slate-800">Mostre este código para o doador</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
