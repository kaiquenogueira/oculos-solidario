import { AlertCircle, X } from 'lucide-react';

interface ModalReportProps {
  show: boolean;
  onClose: () => void;
  reason: string;
  setReason: (r: string) => void;
  onSubmit: () => void;
}

export function ModalReport({ show, onClose, reason, setReason, onSubmit }: ModalReportProps) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-600">
           <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Denunciar Anúncio</h3>
        <p className="text-sm text-slate-500">Por que você está denunciando este anúncio?</p>
        
        <select 
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-500 outline-none"
        >
          <option value="">Selecione um motivo</option>
          <option value="not_glasses">Não é óculos de grau</option>
          <option value="spam">Spam / Propaganda</option>
          <option value="offensive">Conteúdo Ofensivo</option>
          <option value="fraud">Fraude / Golpe</option>
        </select>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold"
          >
            Cancelar
          </button>
          <button 
            onClick={onSubmit}
            className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg"
          >
            Denunciar
          </button>
        </div>
      </div>
    </div>
  );
}
