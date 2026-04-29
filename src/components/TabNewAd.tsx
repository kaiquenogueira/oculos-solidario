import { useRef } from 'react';
import { Camera, PlusCircle, X, AlertCircle } from 'lucide-react';

interface NewAd {
  title: string;
  description: string;
  type: 'donation' | 'exchange';
  frameStyle: string;
  targetAudience: 'adult' | 'child' | 'unisex';
  prescriptionSummary: string;
  photoUrls: string[];
  photoFiles: File[];
}

interface TabNewAdProps {
  newAd: NewAd;
  setNewAd: (ad: NewAd) => void;
  isModerating: boolean;
  onCreateAd: () => void;
}

export function TabNewAd({ newAd, setNewAd, isModerating, onCreateAd }: TabNewAdProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newUrls = filesArray.map(f => URL.createObjectURL(f));
      
      setNewAd({ 
        ...newAd, 
        photoUrls: [...newAd.photoUrls, ...newUrls],
        photoFiles: [...(newAd.photoFiles || []), ...filesArray]
      });
    }
  };

  const removePhoto = (index: number) => {
    // If it's an object URL, we should probably revoke it, but it's okay for now
    const urls = [...newAd.photoUrls];
    urls.splice(index, 1);
    
    const files = [...(newAd.photoFiles || [])];
    if (files.length > index) { // only remove file if it belongs to a local file
       files.splice(index, 1);
    }

    setNewAd({ ...newAd, photoUrls: urls, photoFiles: files });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="px-4 pt-12 space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Novo Anúncio</h1>
      
      <div className="space-y-4">
        <input 
          type="file" 
          accept="image/*" 
          multiple
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {newAd.photoUrls.map((url, i) => (
            <div key={i} className="relative shrink-0 w-32 aspect-square rounded-2xl overflow-hidden border border-slate-200">
              <img src={url} className="w-full h-full object-cover" alt="" />
              <button 
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button 
            onClick={triggerFileInput}
            className="shrink-0 w-32 aspect-square bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-300 transition-all group"
          >
            <PlusCircle size={24} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold">Add Foto</span>
          </button>
        </div>
        
        {newAd.photoUrls.length === 0 && (
          <button 
            onClick={triggerFileInput}
            className="w-full aspect-video bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-300 transition-all group overflow-hidden"
          >
            <Camera size={32} className="mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Adicionar foto do óculos</span>
            <p className="text-[10px] mt-1 px-8 text-center italic">Certifique-se de que o anúncio seja exclusivamente um óculos de grau.</p>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Título</label>
          <input 
            value={newAd.title}
            onChange={(e) => setNewAd({...newAd, title: e.target.value})}
            placeholder="Ex: Óculos de grau unissex retrô"
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Tipo</label>
            <select 
              value={newAd.type}
              onChange={(e) => setNewAd({...newAd, type: e.target.value as any})}
              className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm appearance-none"
            >
              <option value="donation">Doação</option>
              <option value="exchange">Troca</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Público</label>
            <select 
              value={newAd.targetAudience}
              onChange={(e) => setNewAd({...newAd, targetAudience: e.target.value as any})}
              className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm appearance-none"
            >
              <option value="adult">Adulto</option>
              <option value="child">Infantil</option>
              <option value="unisex">Unissex</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Resumo do Grau</label>
          <input 
            value={newAd.prescriptionSummary}
            onChange={(e) => setNewAd({...newAd, prescriptionSummary: e.target.value})}
            placeholder="Ex: -1.5 OD, -1.0 OE"
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Descrição Completa</label>
          <textarea 
            value={newAd.description}
            onChange={(e) => setNewAd({...newAd, description: e.target.value})}
            placeholder="Descreva o estado da armação, lentes, marca..."
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm h-32"
          />
        </div>

        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex items-start">
          <AlertCircle size={16} className="text-yellow-600 mt-0.5 shrink-0" />
          <p className="ml-2 text-[11px] text-yellow-700 leading-tight">
            Seu anúncio passará por uma moderação automática. A publicação de itens que não sejam óculos de grau resultará em banimento.
          </p>
        </div>

        <button 
          onClick={onCreateAd}
          disabled={isModerating || !newAd.title || !newAd.description}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center transition-all ${
            isModerating || !newAd.title || !newAd.description 
              ? 'bg-slate-200 text-slate-400' 
              : 'bg-blue-600 text-white shadow-lg active:scale-95'
          }`}
        >
          {isModerating ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
              Moderando...
            </div>
          ) : 'Publicar Agora'}
        </button>
      </div>
    </div>
  );
}
