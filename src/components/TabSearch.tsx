import { Search, Filter } from 'lucide-react';

interface TabSearchProps {
  onGoToSolidarity: () => void;
}

export function TabSearch({ onGoToSolidarity }: TabSearchProps) {
  return (
    <div className="px-4 pt-12 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Busca</h1>
        <Filter size={20} className="text-slate-400" />
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          placeholder="Pesquisar óculos, grau, cidade..."
          className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 outline-none shadow-inner"
        />
      </div>
      
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-3xl text-white shadow-lg">
        <h2 className="text-lg font-bold mb-1">Precisa de Lentes Novas?</h2>
        <p className="text-purple-100 text-xs leading-tight mb-4">Se você já tem a armação mas não tem condições de comprar as lentes, peça ajuda na aba Solidariedade.</p>
        <button 
          onClick={onGoToSolidarity}
          className="px-4 py-2 bg-white text-blue-600 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-transform"
        >
          Conhecer o Projeto
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Tudo', 'Doação', 'Troca', 'Masculino', 'Feminino', 'Infantil'].map((filter) => (
          <button key={filter} className="shrink-0 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-blue-500 hover:text-blue-500 active:scale-90 transition-all">
            {filter}
          </button>
        ))}
      </div>
      
      <div className="pt-4 text-center">
        <img 
          src="https://illustrations.popsy.co/blue/searching.svg" 
          alt="Search" 
          className="w-48 mx-auto mb-4 opacity-50" 
        />
        <p className="text-slate-400 text-sm">Use os filtros para encontrar óculos<br/>específicos para sua necessidade.</p>
      </div>
    </div>
  );
}
