import { User as UserIcon, Star, Info, ScanLine, Eye, QrCode, MessageCircle, Settings, LogOut, ChevronRight } from 'lucide-react';
import { User, Ad } from '../store/useStore';

interface TabProfileProps {
  user: User | null;
  ads: Ad[];
  onOpenScanner: () => void;
  onOpenMyAds: () => void;
  onOpenModeration: () => void;
  onGoToChat: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function TabProfile({ 
  user, 
  ads, 
  onOpenScanner, 
  onOpenMyAds, 
  onOpenModeration, 
  onGoToChat, 
  onOpenSettings, 
  onLogout 
}: TabProfileProps) {
  const menuItems = [
    { icon: ScanLine, label: 'Escanear Entrega', value: '', action: onOpenScanner },
    { icon: Eye, label: 'Meus Anúncios', value: ads.filter(ad => ad.userId === user?.id).length.toString(), action: onOpenMyAds },
    { icon: QrCode, label: 'Área de Moderação', value: 'Admin', action: onOpenModeration, color: 'text-purple-600' },
    { icon: MessageCircle, label: 'Mensagens', value: '4', action: onGoToChat },
    { icon: Settings, label: 'Preferências', value: '', action: onOpenSettings },
    { icon: LogOut, label: 'Sair', value: '', color: 'text-red-500', action: onLogout }
  ];

  return (
    <div className="px-4 pt-12 space-y-8 pb-24">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 relative shadow-inner">
          <UserIcon size={48} className="text-blue-600" />
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">{user?.name}</h1>
        <p className="text-slate-500 text-sm mb-2">{user?.city}, {user?.state}</p>
        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
          <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-sm font-bold text-blue-700">{user?.rating}</span>
          <span className="text-xs text-blue-400 ml-1">({user?.totalRatings})</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full opacity-50" />
          <h3 className="font-bold text-slate-800 mb-2 relative z-10">Sobre</h3>
          <p className="text-slate-500 text-sm leading-relaxed relative z-10">{user?.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-1 bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
          <div className="p-4 bg-blue-50/50 rounded-2xl mb-2 flex items-start">
             <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
             <p className="ml-3 text-[11px] text-blue-700 leading-tight">
               <b>Dica:</b> Ao entregar ou receber óculos, use o QR Code. Isso remove o anúncio automaticamente para que você não precise se preocupar depois.
             </p>
          </div>
          {menuItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={item.action}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-2xl group"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors ${item.color || 'text-slate-600'}`}>
                  <item.icon size={20} />
                </div>
                <span className={`ml-3 font-semibold ${item.color || 'text-slate-700'}`}>{item.label}</span>
              </div>
              <div className="flex items-center text-slate-400">
                <span className="text-xs font-bold mr-2">{item.value}</span>
                <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
