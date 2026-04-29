import { useRef } from 'react';
import { Camera, Plus, X, AlertTriangle } from 'lucide-react';

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

const SegmentedControl = ({ value, onChange, options }: { value: string; onChange: (v: any) => void; options: { value: string; label: string }[] }) => (
  <div className="segmented-control">
    {options.map((opt) => (
      <button key={opt.value} type="button" onClick={() => onChange(opt.value)} className={value === opt.value ? 'active' : ''}>
        {opt.label}
      </button>
    ))}
  </div>
);

export function TabNewAd({ newAd, setNewAd, isModerating, onCreateAd }: TabNewAdProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newUrls = filesArray.map(f => URL.createObjectURL(f));
      setNewAd({ ...newAd, photoUrls: [...newAd.photoUrls, ...newUrls], photoFiles: [...(newAd.photoFiles || []), ...filesArray] });
    }
  };

  const removePhoto = (index: number) => {
    const urls = [...newAd.photoUrls]; urls.splice(index, 1);
    const files = [...(newAd.photoFiles || [])]; if (files.length > index) files.splice(index, 1);
    setNewAd({ ...newAd, photoUrls: urls, photoFiles: files });
  };

  return (
    <div className="px-5 safe-top pt-4 pb-32">
      <header className="mb-5">
        <span className="kicker kicker-rust">Novo anúncio</span>
        <h1 className="serif-display text-4xl mt-1" style={{ color: 'var(--color-ink)' }}>Componha sua <span className="italic" style={{ color: 'var(--color-rust)' }}>peça</span>.</h1>
      </header>

      <section className="mb-7">
        <span className="kicker block mb-3" style={{ fontSize: '11px' }}>01 · imagens</span>
        <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        {newAd.photoUrls.length === 0 ? (
          <button onClick={() => fileInputRef.current?.click()} className="w-full aspect-[4/3] rounded-2xl flex flex-col items-center justify-center" style={{ background: 'var(--color-paper-2)', border: '2px dashed rgba(26,22,18,0.15)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--color-paper-3)' }}><Camera size={24} strokeWidth={1.4} style={{ color: 'var(--color-ink-3)' }} /></div>
            <span className="font-display text-base italic" style={{ color: 'var(--color-ink-2)' }}>Adicionar fotografia</span>
            <span className="text-xs mt-2" style={{ color: 'var(--color-ink-4)' }}>Apenas óculos de grau</span>
          </button>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {newAd.photoUrls.map((url, i) => (
              <div key={i} className="relative shrink-0 w-28 aspect-square rounded-xl overflow-hidden" style={{ border: '1px solid rgba(26,22,18,0.08)' }}>
                <img src={url} className="w-full h-full object-cover" alt="" />
                <button onClick={() => removePhoto(i)} className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center rounded-full" style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }} aria-label="Remover"><X size={12} /></button>
              </div>
            ))}
            <button onClick={() => fileInputRef.current?.click()} className="shrink-0 w-28 aspect-square rounded-xl flex flex-col items-center justify-center" style={{ background: 'var(--color-paper-2)', border: '2px dashed rgba(26,22,18,0.12)' }}>
              <Plus size={20} strokeWidth={1.5} style={{ color: 'var(--color-ink-3)' }} />
            </button>
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div><label className="kicker block mb-2" style={{ fontSize: '11px' }}>02 · título</label><input value={newAd.title} onChange={(e) => setNewAd({ ...newAd, title: e.target.value })} placeholder="ex.: Óculos unissex retrô em acetato" className="field-paper w-full" /></div>
        <div><label className="kicker block mb-2" style={{ fontSize: '11px' }}>03 · modalidade</label><SegmentedControl value={newAd.type} onChange={(v) => setNewAd({ ...newAd, type: v })} options={[{ value: 'donation', label: 'Doação' }, { value: 'exchange', label: 'Troca' }]} /></div>
        <div><label className="kicker block mb-2" style={{ fontSize: '11px' }}>04 · público</label><SegmentedControl value={newAd.targetAudience} onChange={(v) => setNewAd({ ...newAd, targetAudience: v })} options={[{ value: 'adult', label: 'Adulto' }, { value: 'child', label: 'Infantil' }, { value: 'unisex', label: 'Unissex' }]} /></div>
        <div><label className="kicker block mb-2" style={{ fontSize: '11px' }}>05 · grau</label><input value={newAd.prescriptionSummary} onChange={(e) => setNewAd({ ...newAd, prescriptionSummary: e.target.value })} placeholder="ex.: −1.5 OD, −1.0 OE" className="field-paper w-full font-mono" /></div>
        <div><label className="kicker block mb-2" style={{ fontSize: '11px' }}>06 · descrição</label><textarea value={newAd.description} onChange={(e) => setNewAd({ ...newAd, description: e.target.value })} placeholder="Descreva o estado da armação, marca, lentes…" className="field-paper w-full" /></div>

        <div className="alert-card alert-warning">
          <AlertTriangle size={18} strokeWidth={1.6} className="shrink-0 mt-0.5" style={{ color: 'var(--color-amber)' }} />
          <div>
            <span className="font-mono text-xs tracking-wider uppercase block mb-1 font-medium" style={{ color: '#9A6800', fontSize: '10px' }}>Aviso editorial</span>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>Sua peça passará por moderação automática.</p>
          </div>
        </div>

        <button onClick={onCreateAd} disabled={isModerating || !newAd.title || !newAd.description} className="btn-rust w-full">
          {isModerating ? (<><span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent" style={{ animation: 'spin 0.6s linear infinite' }} />Moderando…</>) : (<>Publicar agora →</>)}
        </button>
      </section>
    </div>
  );
}
