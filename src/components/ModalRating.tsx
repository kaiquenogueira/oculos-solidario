import { Star, X } from 'lucide-react';

interface ModalRatingProps {
  show: boolean;
  onClose: () => void;
  rating: number;
  setRating: (v: number) => void;
  comment: string;
  setComment: (c: string) => void;
  onSubmit: () => void;
}

export function ModalRating({ show, onClose, rating, setRating, comment, setComment, onSubmit }: ModalRatingProps) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center space-y-6">
        <h3 className="text-xl font-bold text-slate-800">Avalie sua experiência</h3>
        <p className="text-sm text-slate-500">Como foi a transação com este usuário?</p>
        
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star} 
              onClick={() => setRating(star)}
              className="transition-transform active:scale-90"
            >
              <Star 
                size={32} 
                className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-200'} 
              />
            </button>
          ))}
        </div>

        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Deixe um comentário (opcional)"
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24"
        />

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold"
          >
            Pular
          </button>
          <button 
            onClick={onSubmit}
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
