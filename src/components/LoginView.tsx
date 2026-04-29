import { Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../store/useStore';
import { MOCK_USER, MOCK_ADS, MOCK_PRESCRIPTION_REQUESTS } from '../data/mockData';

interface LoginViewProps {
  onLogin: (user: User) => void;
  setAds: (ads: any[]) => void;
  addPrescriptionRequest: (req: any) => void;
}

export function LoginView({ onLogin, setAds, addPrescriptionRequest }: LoginViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
          <Eye className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Óculos Solidários</h1>
        <p className="text-slate-500 mb-8 px-4">Conectando quem quer doar e quem precisa ver melhor.</p>
        
        <button 
          onClick={() => {
            onLogin(MOCK_USER);
            setAds(MOCK_ADS);
            MOCK_PRESCRIPTION_REQUESTS.forEach(req => addPrescriptionRequest(req));
          }}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-all shadow-md active:scale-95"
        >
          Entrar com Google
        </button>
        
        <p className="mt-6 text-xs text-slate-400">
          Apenas óculos de grau. Proibido anúncios de outros itens.
        </p>
      </motion.div>
    </div>
  );
}
