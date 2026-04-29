import { Home, Search, Heart, PlusCircle, MessageCircle, User as UserIcon } from 'lucide-react';

type Tab = 'home' | 'search' | 'solidarity' | 'new' | 'chat' | 'profile';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'search', icon: Search, label: 'Busca' },
    { id: 'solidarity', icon: Heart, label: 'Solidário' },
    { id: 'new', icon: PlusCircle, label: 'Criar' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: UserIcon, label: 'Perfil' },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 py-3 px-2 flex justify-around items-end z-40 rounded-t-3xl shadow-lg">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id as Tab)}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
            activeTab === tab.id ? 'text-blue-600 scale-110' : 'text-slate-400'
          }`}
        >
          <tab.icon size={activeTab === tab.id ? 26 : 22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className={`text-[10px] mt-1 font-bold ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
