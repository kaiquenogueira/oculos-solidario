import { X, AlertCircle, User, Star, ChevronRight, QrCode, Info, CheckCircle2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ad } from '../store/useStore';

interface ModalAdDetailProps {
  ad: Ad | null;
  onClose: () => void;
  activePhotoIndex: number;
  setActivePhotoIndex: (index: number) => void;
  onGenerateQRCode: () => void;
  onCompleteAd: (id: string) => void;
  onManifestInterest: (ad: Ad) => void;
}

export function ModalAdDetail({ 
  ad, 
  onClose, 
  activePhotoIndex, 
  setActivePhotoIndex, 
  onGenerateQRCode, 
  onCompleteAd, 
  onManifestInterest 
}: ModalAdDetailProps) {
  if (!ad) return null;

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-50 bg-white flex flex-col"
    >
      <div className="relative h-72">
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
          onScroll={(e) => {
            const index = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
            setActivePhotoIndex(index);
          }}
        >
          {(ad.photoUrls || [ad.photoUrl]).map((url, i) => (
            <div key={i} className="min-w-full h-full snap-center relative">
              <img src={url} className="w-full h-full object-cover" alt="" />
            </div>
          ))}
        </div>
        
        {/* Indicators */}
        {(ad.photoUrls?.length || 0) > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4">
            {ad.photoUrls.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activePhotoIndex === i ? 'bg-white w-6' : 'bg-white/40 w-1.5'
                }`} 
              />
            ))}
          </div>
        )}

        <button 
          onClick={onClose}
          className="absolute top-12 left-4 w-10 h-10 bg-black/20 backdrop-blur rounded-full flex items-center justify-center text-white z-10"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{ad.title}</h2>
            <p className="text-blue-600 font-bold text-sm uppercase mt-1">
              {ad.type === 'donation' ? 'Doação' : 'Disponível para Troca'}
            </p>
          </div>
          <div className="bg-slate-100 p-2 rounded-xl">
            <AlertCircle size={20} className="text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Resumo do Grau</p>
            <p className="text-sm font-bold text-blue-800">{ad.prescriptionSummary}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Público</p>
            <p className="text-sm font-bold text-slate-800 capitalize">
              {ad.targetAudience === 'adult' ? 'Adulto' : ad.targetAudience === 'child' ? 'Infantil' : 'Unissex'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 mb-2">Descrição</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{ad.description}</p>
        </div>

        <div className="flex items-center p-4 bg-slate-50 rounded-2xl">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <User size={24} className="text-slate-400" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-bold text-slate-800">Doador #{ad.userId.slice(-3)}</p>
            <div className="flex items-center">
              <Star size={10} className="text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-[10px] text-slate-500">4.5 (8 avaliações)</span>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300" />
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-white space-y-3">
        <button 
          onClick={onGenerateQRCode}
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold flex items-center justify-center transition-colors shadow-lg"
        >
          <QrCode size={20} className="mr-2" />
          Gerar QR Code de Retirada
        </button>
        <div className="flex items-center gap-2 px-2 py-1 bg-purple-50 rounded-xl">
          <Info size={14} className="text-purple-600" />
          <p className="text-[10px] text-purple-700">Válido por 24h. Mostre ao doador no momento da entrega.</p>
        </div>
        <button 
          onClick={() => onCompleteAd(ad.id)}
          className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center transition-colors"
        >
          <CheckCircle2 size={20} className="mr-2" />
          Finalizar Doação/Troca
        </button>
        <button 
          onClick={() => onManifestInterest(ad)}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center transition-colors shadow-lg"
        >
          <MessageCircle size={20} className="mr-2" />
          Manifestar Interesse
        </button>
      </div>
    </motion.div>
  );
}
