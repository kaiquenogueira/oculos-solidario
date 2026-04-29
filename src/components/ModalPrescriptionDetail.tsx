import { ChevronRight, User, Info, HandHeart, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { PrescriptionRequest, User as UserType } from '../store/useStore';
import { createClient } from '../lib/supabase/client';
import { useEffect, useState } from 'react';

interface ModalPrescriptionDetailProps {
  request: PrescriptionRequest | null;
  onClose: () => void;
  user: UserType | null;
  onAdopt: (id: string, userId: string) => void;
  onShowQR: () => void;
}

export function ModalPrescriptionDetail({ 
  request, 
  onClose, 
  user, 
  onAdopt, 
  onShowQR 
}: ModalPrescriptionDetailProps) {
  const supabase = createClient();
  const [prescriptionUrl, setPrescriptionUrl] = useState<string>('');
  const [documentUrl, setDocumentUrl] = useState<string>('');

  useEffect(() => {
    if (!request) return;
    const fetchUrls = async () => {
      if (request.prescriptionPhotoUrl) {
        const { data } = await supabase.storage.from('private-prescriptions').createSignedUrl(request.prescriptionPhotoUrl, 60 * 60);
        if (data) setPrescriptionUrl(data.signedUrl);
      }
      if (request.documentPhotoUrl) {
        const { data } = await supabase.storage.from('private-prescriptions').createSignedUrl(request.documentPhotoUrl, 60 * 60);
        if (data) setDocumentUrl(data.signedUrl);
      }
    };
    fetchUrls();
  }, [request]);

  if (!request) return null;

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute inset-0 z-50 bg-white flex flex-col pt-12"
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-50">
        <button onClick={onClose} className="p-2 -ml-2 text-blue-600">
           <ChevronRight size={24} className="rotate-180" />
        </button>
        <h3 className="font-bold text-slate-800">Detalhes do Pedido</h3>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={32} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{request.patientName}</h2>
            <p className="text-xs text-slate-400 capitalize">{request.neighborhood}, {request.city}</p>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
          <h4 className="text-xs font-bold text-red-600 uppercase mb-1">Resumo da Receita</h4>
          <p className="text-lg font-bold text-red-800">{request.prescriptionSummary}</p>
        </div>

        <div>
           <h3 className="font-bold text-slate-800 mb-2">História</h3>
           <p className="text-slate-600 text-sm leading-relaxed italic">"{request.description}"</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase">Receita Médica</h4>
            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
               {prescriptionUrl && <img src={prescriptionUrl} className="w-full h-full object-cover" alt="Receita" />}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase">Documento Ident.</h4>
            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
               {documentUrl && <img src={documentUrl} className="w-full h-full object-cover" alt="Documento" />}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
           <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
           <p className="text-xs text-blue-700 leading-tight">
             <b>Transparência:</b> A receita e o documento foram verificados para garantir que a doação chegue a quem realmente precisa.
           </p>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 space-y-3">
        {request.status === 'adopted' ? (
           <div className="text-center py-4 px-6 bg-green-50 rounded-2xl border border-green-100">
              <p className="text-green-700 font-bold">Este pedido já foi adotado por um padrinho!</p>
              <button 
                onClick={onShowQR}
                className="mt-4 w-full py-4 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center"
              >
                 <QrCode size={20} className="mr-2" />
                 Mostrar QR Code de Recebimento
              </button>
           </div>
        ) : (
          <button 
            onClick={() => {
              if (user) onAdopt(request.id, user.id);
            }}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <HandHeart size={20} className="mr-2" />
            Adotar Pedido (Comprar Lentes)
          </button>
        )}
        <button 
          onClick={onClose}
          className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold"
        >
          Voltar
        </button>
      </div>
    </motion.div>
  );
}
