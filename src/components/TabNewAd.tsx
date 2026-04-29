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

const SegmentedControl = ({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: any) => void;
  options: { value: string; label: string }[];
}) => (
  <div className="flex hairline" style={{ background: 'var(--color-paper-2)' }}>
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="flex-1 py-3 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors"
          style={{
            background: active ? 'var(--color-ink)' : 'transparent',
            color: active ? 'var(--color-paper)' : 'var(--color-ink-2)',
          }}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

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
    const urls = [...newAd.photoUrls]; urls.splice(index, 1);
    const files = [...(newAd.photoFiles || [])];
    if (files.length > index) files.splice(index, 1);
    setNewAd({ ...newAd, photoUrls: urls, photoFiles: files });
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="px-6 pt-10 pb-28">
      {/* Header */}
      <header className="mb-5">
        <span className="kicker kicker-rust">Diagramação · novo anúncio</span>
        <h1 className="serif-display text-[44px] mt-1" style={{ color: 'var(--color-ink)' }}>
          Componha sua <span className="italic" style={{ color: 'var(--color-rust)' }}>peça</span>.
        </h1>
      </header>
      <div className="rule-double mb-7"></div>

      {/* Photos */}
      <section className="mb-8">
        <span className="kicker block mb-3">— 01 · imagens —</span>
        <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />

        {newAd.photoUrls.length === 0 ? (
          <button
            onClick={triggerFileInput}
            className="w-full aspect-[4/3] hairline flex flex-col items-center justify-center text-center group transition-colors"
            style={{ background: 'var(--color-paper-2)' }}
          >
            <Camera size={28} strokeWidth={1.3} style={{ color: 'var(--color-ink-3)' }} className="mb-3" />
            <span className="font-display text-lg italic" style={{ color: 'var(--color-ink-2)' }}>Adicionar fotografia</span>
            <span className="kicker mt-2 max-w-[70%]">Apenas óculos de grau · banimento em caso de descumprimento</span>
          </button>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {newAd.photoUrls.map((url, i) => (
              <div key={i} className="relative shrink-0 w-32 aspect-square hairline overflow-hidden">
                <img src={url} className="w-full h-full object-cover" alt="" />
                <span className="absolute bottom-1 left-1 numeral text-[8px] px-1" style={{ background: 'var(--color-paper)', color: 'var(--color-ink)' }}>
                  fig. {String(i + 1).padStart(2, '0')}
                </span>
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center"
                  style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
                  aria-label="Remover"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              onClick={triggerFileInput}
              className="shrink-0 w-32 aspect-square hairline flex flex-col items-center justify-center"
              style={{ background: 'var(--color-paper-2)', borderStyle: 'dashed' }}
            >
              <Plus size={20} strokeWidth={1.5} style={{ color: 'var(--color-ink-3)' }} />
              <span className="kicker mt-2">add fig.</span>
            </button>
          </div>
        )}
      </section>

      {/* Form */}
      <section className="space-y-7">
        <div>
          <label className="kicker block mb-2">— 02 · título —</label>
          <input
            value={newAd.title}
            onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
            placeholder="ex.: Óculos unissex retrô em acetato"
            className="field-paper w-full"
          />
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="kicker block mb-2">— 03 · modalidade —</label>
            <SegmentedControl
              value={newAd.type}
              onChange={(v) => setNewAd({ ...newAd, type: v })}
              options={[
                { value: 'donation', label: 'Doação' },
                { value: 'exchange', label: 'Troca' },
              ]}
            />
          </div>

          <div>
            <label className="kicker block mb-2">— 04 · público —</label>
            <SegmentedControl
              value={newAd.targetAudience}
              onChange={(v) => setNewAd({ ...newAd, targetAudience: v })}
              options={[
                { value: 'adult',  label: 'Adulto' },
                { value: 'child',  label: 'Infantil' },
                { value: 'unisex', label: 'Unissex' },
              ]}
            />
          </div>
        </div>

        <div>
          <label className="kicker block mb-2">— 05 · grau —</label>
          <input
            value={newAd.prescriptionSummary}
            onChange={(e) => setNewAd({ ...newAd, prescriptionSummary: e.target.value })}
            placeholder="ex.: −1.5 OD, −1.0 OE"
            className="field-paper w-full font-mono"
          />
        </div>

        <div>
          <label className="kicker block mb-2">— 06 · descrição —</label>
          <textarea
            value={newAd.description}
            onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
            placeholder="Descreva o estado da armação, marca, lentes…"
            className="field-paper w-full h-32 resize-none"
          />
        </div>

        {/* Warning */}
        <div className="p-4 grain-overlay relative" style={{ background: 'var(--color-amber)', color: 'var(--color-ink)' }}>
          <div className="flex items-start gap-3 relative z-10">
            <AlertTriangle size={16} strokeWidth={1.8} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase block mb-1">Aviso editorial</span>
              <p className="font-display text-[13px] italic leading-snug">
                Sua peça passará por moderação automática. Conteúdos fora da curadoria resultam em banimento.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onCreateAd}
          disabled={isModerating || !newAd.title || !newAd.description}
          className="btn-rust w-full"
        >
          {isModerating ? (
            <>
              <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin"></span>
              Moderando…
            </>
          ) : (
            <>Publicar agora →</>
          )}
        </button>
      </section>
    </div>
  );
}
