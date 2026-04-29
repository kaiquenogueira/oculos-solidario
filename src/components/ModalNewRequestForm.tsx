import { useRef } from 'react';
import { X, Camera, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface NewRequest {
  patientName: string;
  description: string;
  prescriptionSummary: string;
  prescriptionPhotoFile?: File;
  documentPhotoFile?: File;
}

interface ModalNewRequestFormProps {
  show: boolean;
  onClose: () => void;
  newRequest: NewRequest;
  setNewRequest: (req: NewRequest) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function ModalNewRequestForm({
  show, onClose, newRequest, setNewRequest, onSubmit, isSubmitting = false
}: ModalNewRequestFormProps) {
  const prescriptionInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  const FileSlot = ({
    file, label, num, onClick,
  }: { file?: File; label: string; num: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full hairline px-5 py-6 flex items-center gap-4 text-left transition-colors"
      style={file ? { background: 'var(--color-sage)', color: 'var(--color-paper)', borderColor: 'var(--color-sage)' } : { background: 'var(--color-paper-2)' }}
    >
      <span className="numeral text-[11px] shrink-0" style={{ opacity: file ? 0.7 : 0.5 }}>
        {num}
      </span>
      {file ? (
        <CheckCircle2 size={18} strokeWidth={1.5} className="shrink-0" />
      ) : (
        <Camera size={18} strokeWidth={1.5} className="shrink-0" style={{ color: 'var(--color-ink-3)' }} />
      )}
      <div className="flex-1">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase block opacity-80">
          {file ? 'anexado' : 'obrigatório'}
        </span>
        <span className="font-display text-[16px] mt-0.5 block">
          {file ? `${label} pronto para envio` : label}
        </span>
      </div>
    </button>
  );

  return (
    <div className="absolute inset-0 z-[60] flex flex-col paper-grain" style={{ background: 'var(--color-paper)' }}>
      <header
        className="px-5 pt-10 pb-4 flex items-center gap-3 relative z-10"
        style={{ background: 'var(--color-paper)', borderBottom: '1px solid rgba(26,22,18,0.18)' }}
      >
        <button onClick={onClose} className="p-1 -ml-1" aria-label="Fechar">
          <X size={18} strokeWidth={1.5} style={{ color: 'var(--color-ink)' }} />
        </button>
        <div className="flex-1">
          <span className="kicker kicker-sage">Caderno solidário · novo pedido</span>
          <h3 className="font-display text-[20px] leading-tight mt-0.5" style={{ color: 'var(--color-ink)' }}>
            Pedir ajuda com lentes
          </h3>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-7 pb-4 space-y-7 relative z-10">
        <div>
          <label className="kicker block mb-2">— 01 · paciente —</label>
          <input
            value={newRequest.patientName}
            onChange={(e) => setNewRequest({ ...newRequest, patientName: e.target.value })}
            placeholder="ex.: João da Silva"
            className="field-paper w-full"
          />
        </div>

        <div>
          <label className="kicker block mb-2">— 02 · grau —</label>
          <input
            value={newRequest.prescriptionSummary}
            onChange={(e) => setNewRequest({ ...newRequest, prescriptionSummary: e.target.value })}
            placeholder="ex.: Miopia −2.0 em ambos"
            className="field-paper w-full font-mono"
          />
        </div>

        <div>
          <label className="kicker block mb-2">— 03 · sua história —</label>
          <textarea
            value={newRequest.description}
            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
            placeholder="Conte por que precisa de ajuda com as lentes…"
            className="field-paper w-full h-32 resize-none"
          />
        </div>

        <div className="space-y-3">
          <span className="kicker block">— 04 · documentação —</span>
          <input
            type="file" accept="image/*" className="hidden" ref={prescriptionInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setNewRequest({ ...newRequest, prescriptionPhotoFile: e.target.files[0] });
              }
            }}
          />
          <FileSlot
            file={newRequest.prescriptionPhotoFile}
            label="Anexar receita médica"
            num="04.a"
            onClick={() => prescriptionInputRef.current?.click()}
          />
          <input
            type="file" accept="image/*" className="hidden" ref={documentInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setNewRequest({ ...newRequest, documentPhotoFile: e.target.files[0] });
              }
            }}
          />
          <FileSlot
            file={newRequest.documentPhotoFile}
            label="Anexar documento com foto"
            num="04.b"
            onClick={() => documentInputRef.current?.click()}
          />
        </div>

        <div className="p-4 flex items-start gap-3 grain-overlay relative" style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}>
          <ShieldCheck size={16} strokeWidth={1.6} className="shrink-0 mt-0.5 relative z-10" />
          <p className="font-display italic text-[13px] leading-snug relative z-10">
            Para evitar fraudes, exigimos receita dos últimos 6 meses e documento com foto. Os arquivos ficam em armário privado.
          </p>
        </div>
      </div>

      <div
        className="px-6 py-5"
        style={{ background: 'var(--color-paper)', borderTop: '1px solid rgba(26,22,18,0.18)' }}
      >
        <button onClick={onSubmit} disabled={isSubmitting} className="btn-sage w-full">
          {isSubmitting ? (
            <>
              <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin"></span>
              Protegendo arquivos…
            </>
          ) : (
            <>Enviar pedido →</>
          )}
        </button>
      </div>
    </div>
  );
}
