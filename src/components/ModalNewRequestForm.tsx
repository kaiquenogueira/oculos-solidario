import { useRef } from 'react';
import { X, Camera, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface NewRequest { patientName: string; description: string; prescriptionSummary: string; prescriptionPhotoFile?: File; documentPhotoFile?: File; }

interface ModalNewRequestFormProps {
  show: boolean; onClose: () => void; newRequest: NewRequest; setNewRequest: (req: NewRequest) => void; onSubmit: () => void; isSubmitting?: boolean;
}

export function ModalNewRequestForm({ show, onClose, newRequest, setNewRequest, onSubmit, isSubmitting = false }: ModalNewRequestFormProps) {
  const prescriptionInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  if (!show) return null;

  const FileSlot = ({ file, label, onClick }: { file?: File; label: string; onClick: () => void }) => (
    <button type="button" onClick={onClick} className="w-full p-4 flex items-center gap-4 text-left rounded-xl transition-colors" style={file ? { background: 'var(--color-sage-bg)', border: '1px solid rgba(58,130,54,0.15)' } : { background: 'var(--color-paper-2)', border: '2px dashed rgba(26,22,18,0.12)' }}>
      {file ? <CheckCircle2 size={20} strokeWidth={1.5} style={{ color: 'var(--color-sage)' }} /> : <Camera size={20} strokeWidth={1.5} style={{ color: 'var(--color-ink-3)' }} />}
      <div className="flex-1">
        <span className="text-xs tracking-wider uppercase block font-medium" style={{ color: file ? 'var(--color-sage)' : 'var(--color-ink-4)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{file ? 'Anexado ✓' : 'Obrigatório'}</span>
        <span className="text-sm mt-0.5 block" style={{ fontFamily: 'var(--font-display)' }}>{file ? `${label} pronto` : label}</span>
      </div>
    </button>
  );

  return (
    <div className="absolute inset-0 z-[60] flex flex-col" style={{ background: 'var(--color-paper)' }}>
      <div className="drag-indicator" />
      <header className="px-5 pt-3 pb-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(26,22,18,0.08)' }}>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: 'var(--color-paper-2)' }} aria-label="Fechar"><X size={18} strokeWidth={1.6} style={{ color: 'var(--color-ink)' }} /></button>
        <div className="flex-1">
          <span className="kicker kicker-sage" style={{ fontSize: '10px' }}>Caderno solidário</span>
          <h3 className="font-display text-lg leading-tight" style={{ color: 'var(--color-ink)' }}>Pedir ajuda com lentes</h3>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4 space-y-6">
        <div><label className="kicker block mb-2" style={{ fontSize: '11px' }}>01 · paciente</label><input value={newRequest.patientName} onChange={(e) => setNewRequest({ ...newRequest, patientName: e.target.value })} placeholder="ex.: João da Silva" className="field-paper w-full" /></div>
        <div><label className="kicker block mb-2" style={{ fontSize: '11px' }}>02 · grau</label><input value={newRequest.prescriptionSummary} onChange={(e) => setNewRequest({ ...newRequest, prescriptionSummary: e.target.value })} placeholder="ex.: Miopia −2.0 em ambos" className="field-paper w-full font-mono" /></div>
        <div><label className="kicker block mb-2" style={{ fontSize: '11px' }}>03 · sua história</label><textarea value={newRequest.description} onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })} placeholder="Conte por que precisa de ajuda…" className="field-paper w-full" /></div>

        <div className="space-y-3">
          <span className="kicker block" style={{ fontSize: '11px' }}>04 · documentação</span>
          <input type="file" accept="image/*" className="hidden" ref={prescriptionInputRef} onChange={(e) => { if (e.target.files?.[0]) setNewRequest({ ...newRequest, prescriptionPhotoFile: e.target.files[0] }); }} />
          <FileSlot file={newRequest.prescriptionPhotoFile} label="Anexar receita médica" onClick={() => prescriptionInputRef.current?.click()} />
          <input type="file" accept="image/*" className="hidden" ref={documentInputRef} onChange={(e) => { if (e.target.files?.[0]) setNewRequest({ ...newRequest, documentPhotoFile: e.target.files[0] }); }} />
          <FileSlot file={newRequest.documentPhotoFile} label="Anexar documento com foto" onClick={() => documentInputRef.current?.click()} />
        </div>

        <div className="alert-card alert-dark">
          <ShieldCheck size={18} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: 'var(--color-sage-soft)' }} />
          <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>Exigimos receita dos últimos 6 meses e documento com foto. Os arquivos ficam em armário privado.</p>
        </div>
      </div>

      <div className="px-5 py-4 safe-bottom" style={{ borderTop: '1px solid rgba(26,22,18,0.08)' }}>
        <button onClick={onSubmit} disabled={isSubmitting} className="btn-sage w-full">
          {isSubmitting ? (<><span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent" style={{ animation: 'spin 0.6s linear infinite' }} />Protegendo…</>) : (<>Enviar pedido →</>)}
        </button>
      </div>
    </div>
  );
}
