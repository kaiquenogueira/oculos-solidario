import { X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ad } from '../store/useStore';

interface MapOverlayProps {
  show: boolean;
  onClose: () => void;
  ads: Ad[];
  onSelectAd: (ad: Ad) => void;
}

export function MapOverlay({ show, onClose, ads, onSelectAd }: MapOverlayProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[60] bg-slate-100 flex flex-col"
      >
        <div className="absolute top-12 left-4 right-4 z-10 flex justify-between items-center">
          <button onClick={onClose} className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-600">
            <X size={24} />
          </button>
          <div className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-bold text-slate-800">
            {ads.length} itens na região
          </div>
          <div className="w-10"></div>
        </div>
        
        {/* Mock Map Background */}
        <div className="flex-1 bg-slate-200 relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 grayscale" alt="" />
          
          {ads.slice(0, 5).map((ad, i) => (
            <div 
              key={ad.id}
              className="absolute"
              style={{ top: `${20 + i * 15}%`, left: `${20 + i * 12}%` }}
            >
              <div 
                className="relative group cursor-pointer" 
                onClick={() => onSelectAd(ad)}
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white overflow-hidden">
                  <img src={ad.photoUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm border border-slate-100 scale-0 group-hover:scale-100 transition-transform origin-top">
                  <p className="text-[10px] font-bold text-slate-800">{ad.title}</p>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
              </div>
            </div>
          ))}

          {/* User Location */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="relative">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-ping absolute inset-0" />
                <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-2xl relative flex items-center justify-center">
                   <div className="w-2 h-2 bg-white rounded-full" />
                </div>
             </div>
          </div>
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
           <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {ads.filter(a => a.status === 'active').slice(0, 4).map(ad => (
                <div 
                  key={ad.id} 
                  onClick={() => onSelectAd(ad)}
                  className="shrink-0 w-64 bg-white rounded-2xl p-3 flex gap-3 shadow-md border border-slate-100"
                >
                   <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                      <img src={ad.photoUrl} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate text-sm">{ad.title}</h4>
                      <div className="flex items-center text-slate-400 text-[10px] mt-1">
                        <MapPin size={10} className="mr-1" />
                        <span className="truncate">{ad.neighborhood}</span>
                      </div>
                      <p className="text-[9px] font-bold text-blue-600 uppercase mt-1">{ad.type === 'donation' ? 'Doação' : 'Troca'}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
