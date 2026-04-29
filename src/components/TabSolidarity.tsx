import { Heart, HandHeart, PlusCircle, User, MapPin, FileBadge, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PrescriptionRequest } from '../store/useStore';

interface TabSolidarityProps {
  prescriptionRequests: PrescriptionRequest[];
  onSelectRequest: (request: PrescriptionRequest) => void;
  onOpenNewRequestForm: () => void;
}

export function TabSolidarity({ prescriptionRequests, onSelectRequest, onOpenNewRequestForm }: TabSolidarityProps) {
  return (
    <div className="px-4 pt-12 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Solidariedade</h1>
        <Heart className="text-red-500 fill-red-500" size={24} />
      </div>
      
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
         <div className="relative z-10">
           <h2 className="text-lg font-bold mb-2">Seja um Padrinho Visual</h2>
           <p className="text-blue-100 text-sm leading-tight mb-4">Muitas famílias têm a armação, mas não conseguem comprar as lentes. Ajude alguém a enxergar um futuro melhor.</p>
           <div className="flex gap-2">
             <button 
               onClick={() => {
                 alert("Ao adotar um pedido, você se compromete a comprar as lentes de acordo com a receita médica apresentada. A entrega é confirmada via QR Code.");
               }}
               className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-xs font-bold transition-all"
             >
               Como funciona?
             </button>
           </div>
         </div>
         <HandHeart className="absolute -right-8 -bottom-8 text-white opacity-10" size={160} />
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-700">Pedidos de Ajuda</h3>
        <button 
          onClick={onOpenNewRequestForm}
          className="text-blue-600 text-xs font-bold flex items-center bg-blue-50 px-3 py-1.5 rounded-full"
        >
          <PlusCircle size={14} className="mr-1" />
          Pedir Ajuda
        </button>
      </div>

      <div className="space-y-4">
        {prescriptionRequests.length === 0 ? (
          <div className="text-center py-10 opacity-40">
            <Heart size={48} className="mx-auto mb-4" />
            <p>Nenhum pedido no momento.</p>
          </div>
        ) : (
          prescriptionRequests.map((req) => (
            <motion.div 
              key={req.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRequest(req)}
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3 relative overflow-hidden"
            >
              {req.status === 'adopted' && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-bl-xl">
                  ADOTADO
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <User className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{req.patientName}</h4>
                  <p className="text-[10px] text-slate-400 font-medium flex items-center">
                    <MapPin size={10} className="mr-1" />
                    {req.neighborhood}, {req.city}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed italic">"{req.description}"</p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                <div className="flex items-center text-blue-600">
                  <FileBadge size={14} className="mr-1" />
                  <span className="text-xs font-bold">{req.prescriptionSummary}</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
