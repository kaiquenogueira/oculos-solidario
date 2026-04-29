import { Bell, User, Eye, MapPin, Map as MapIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { User as UserType, Ad } from '../store/useStore';

interface TabHomeProps {
  user: UserType | null;
  ads: Ad[];
  onSelectAd: (ad: Ad) => void;
  onOpenNotifications: () => void;
  onOpenMap: () => void;
}

export function TabHome({ user, ads, onSelectAd, onOpenNotifications, onOpenMap }: TabHomeProps) {
  return (
    <div className="space-y-6 pb-24 px-4 pt-12">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Olá, {user?.name.split(' ')[0]}</h1>
          <p className="text-slate-500 text-sm">Encontre o que você precisa hoje.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative active:scale-90 transition-transform"
          >
            <Bell size={20} className="text-slate-600" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            <User className="text-blue-600 w-6 h-6" />
          </div>
        </div>
      </header>

      <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold mb-1">Dica de Saúde</h2>
          <p className="text-blue-100 text-sm leading-tight">Mantenha seu exame de vista em dia antes de trocar suas lentes.</p>
          <button className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-xs font-bold transition-colors">
            Saiba mais
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
          <Eye size={120} />
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-700">Anúncios Próximos</h3>
          <button 
            onClick={onOpenMap}
            className="text-blue-600 text-xs font-bold flex items-center hover:underline"
          >
            <MapIcon size={14} className="mr-1" />
            Ver Mapa
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {ads.filter(ad => ad.status === 'active').map((ad) => (
            <motion.div 
              key={ad.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectAd(ad)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group"
            >
              <div className="h-32 bg-slate-200 relative overflow-hidden">
                <img src={ad.photoUrl} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded-full shadow-sm">
                  <p className="text-[10px] font-bold text-blue-600 uppercase">
                    {ad.type === 'donation' ? 'Doação' : 'Troca'}
                  </p>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{ad.title}</h4>
                <div className="flex items-center text-slate-400 text-[10px] mt-1">
                  <MapPin size={10} className="mr-1" />
                  <span className="truncate">{ad.neighborhood}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
