import { useRef } from 'react';
import { X, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';

interface NewRequest {
  patientName: string;
  description: string;
  prescriptionSummary: string;
  prescriptionPhotoFile?: File;
  documentPhotoFile?: File;
}

interface ModalNewRequestFormProps {
  show: boolean;
  onClose: () => void;
  newRequest: NewRequest;
  setNewRequest: (req: NewRequest) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function ModalNewRequestForm({ 
  show, 
  onClose, 
  newRequest, 
  setNewRequest, 
  onSubmit,
  isSubmitting = false
}: ModalNewRequestFormProps) {
  const prescriptionInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-[60] bg-white pt-12 flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-slate-50">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-400">
          <X size={24} />
        </button>
        <h3 className="font-bold text-slate-800">Pedir Ajuda com Lentes</h3>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
           <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Nome do Paciente</label>
           <input 
             value={newRequest.patientName}
             onChange={(e) => setNewRequest({...newRequest, patientName: e.target.value})}
             placeholder="Ex: João da Silva"
             className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
           />
        </div>

        <div>
           <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Grau Resumido</label>
           <input 
             value={newRequest.prescriptionSummary}
             onChange={(e) => setNewRequest({...newRequest, prescriptionSummary: e.target.value})}
             placeholder="Ex: Miopia -2.0 em ambos"
             className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
           />
        </div>

        <div>
           <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Sua História</label>
           <textarea 
             value={newRequest.description}
             onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
             placeholder="Conte por que você precisa de ajuda com as lentes..."
             className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32"
           />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={prescriptionInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setNewRequest({...newRequest, prescriptionPhotoFile: e.target.files[0]});
              }
            }}
          />
          <button 
            onClick={() => prescriptionInputRef.current?.click()}
            className={`w-full py-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all group ${newRequest.prescriptionPhotoFile ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}
          >
             {newRequest.prescriptionPhotoFile ? (
               <>
                 <CheckCircle2 size={32} className="mb-2" />
                 <span className="text-sm font-medium">Receita Anexada</span>
               </>
             ) : (
               <>
                 <Camera size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-medium">Anexar Receita (Obrigatório)</span>
               </>
             )}
          </button>

          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={documentInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setNewRequest({...newRequest, documentPhotoFile: e.target.files[0]});
              }
            }}
          />
          <button 
            onClick={() => documentInputRef.current?.click()}
            className={`w-full py-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all group ${newRequest.documentPhotoFile ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}
          >
             {newRequest.documentPhotoFile ? (
               <>
                 <CheckCircle2 size={32} className="mb-2" />
                 <span className="text-sm font-medium">Documento Anexado</span>
               </>
             ) : (
               <>
                 <Camera size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-medium">Anexar Documento (ID)</span>
               </>
             )}
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
           <AlertCircle size={18} className="text-blue-600 mt-0.5 shrink-0" />
           <p className="text-[11px] text-blue-700 leading-tight">
             Para evitar fraudes, solicitamos fotos nítidas da receita médica (últimos 6 meses) e de um documento com foto. Seus dados estão seguros.
           </p>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100">
         <button 
           onClick={onSubmit}
           disabled={isSubmitting}
           className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all ${isSubmitting ? 'bg-slate-300 text-slate-500' : 'bg-blue-600 text-white active:scale-95'}`}
         >
           {isSubmitting ? 'Enviando e protegendo arquivos...' : 'Enviar Pedido'}
         </button>
      </div>
    </div>
  );
}
