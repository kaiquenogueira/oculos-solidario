import { ArrowLeft, MapPin, QrCode, HandHeart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { PrescriptionRequest, User as UserType } from '../store/useStore';
import { createClient } from '../lib/supabase/client';
import { useEffect, useState } from 'react';

interface ModalPrescriptionDetailProps {
  request: PrescriptionRequest | null; onClose: () => void; user: UserType | null;
  onAdopt: (id: string, userId: string) => void; onShowQR: () => void;
}

export function ModalPrescriptionDetail({ request, onClose, user, onAdopt, onShowQR }: ModalPrescriptionDetailProps) {
  const supabase = createClient();
  const [prescriptionUrl, setPrescriptionUrl] = useState<string>('');
  const [documentUrl, setDocumentUrl] = useState<string>('');

  useEffect(() => {
    if (!request) return;
    const fetchUrls = async () => {
      if (request.prescriptionPhotoUrl) {
        const { data } = await supabase.storage.from('private-prescriptions').createSignedUrl(request.prescriptionPhotoUrl, 60 * 60);
        if (data) setPrescriptionUrl(data.signedUrl);
      }
      if (request.documentPhotoUrl) {
        const { data } = await supabase.storage.from('private-prescriptions').createSignedUrl(request.documentPhotoUrl, 60 * 60);
        if (data) setDocumentUrl(data.signedUrl);
      }
    };
    fetchUrls();
  }, [request]);

  if (!request) return null;
  const initials = (request.patientName || '?').split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute inset-0 z-50 flex flex-col" style={{ background: 'var(--color-paper)' }}>
      <div className="drag-indicator" />

      <header className="px-5 pt-3 pb-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(26,22,18,0.08)' }}>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: 'var(--color-paper-2)' }} aria-label="Voltar">
          <ArrowLeft size={18} strokeWidth={1.6} style={{ color: 'var(--color-ink)' }} />
        </button>
        <div className="flex-1">
          <span className="kicker kicker-sage" style={{ fontSize: '10px' }}>Caderno solidário</span>
          <h3 className="font-display text-lg leading-tight" style={{ color: 'var(--color-ink)' }}>Pedido #{request.id.slice(0, 6).toUpperCase()}</h3>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4">
        {/* Patient identity */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--color-sage)', color: 'var(--color-paper)', boxShadow: '0 0 0 3px var(--color-paper), 0 0 0 4px rgba(58,130,54,0.15)' }}>
            <span className="font-display text-xl">{initials}</span>
          </div>
          <div className="flex-1">
            <h2 className="serif-display text-2xl leading-tight" style={{ color: 'var(--color-ink)' }}>{request.patientName}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} strokeWidth={1.5} style={{ color: 'var(--color-ink-4)' }} />
              <span className="text-xs" style={{ color: 'var(--color-ink-3)' }}>{request.neighborhood}, {request.city}</span>
            </div>
          </div>
        </div>

        {/* Prescription */}
        <div className="p-4 rounded-xl mb-5" style={{ background: 'var(--color-rust-bg)' }}>
          <span className="kicker kicker-rust" style={{ fontSize: '10px' }}>Receita resumida</span>
          <p className="font-mono text-lg mt-1" style={{ color: 'var(--color-rust)' }}>{request.prescriptionSummary || '—'}</p>
        </div>

        <span className="kicker block mb-2" style={{ fontSize: '11px' }}>A história</span>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>"{request.description}"</p>

        <div className="rule mb-5" />

        {/* Documents */}
        <span className="kicker block mb-3" style={{ fontSize: '11px' }}>Documentação verificada</span>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <span className="text-xs block mb-1.5" style={{ color: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>Receita</span>
            <div className="aspect-square rounded-xl overflow-hidden" style={{ background: 'var(--color-paper-2)', border: '1px solid rgba(26,22,18,0.06)' }}>
              {prescriptionUrl && <img src={prescriptionUrl} className="w-full h-full object-cover" alt="Receita" />}
            </div>
          </div>
          <div>
            <span className="text-xs block mb-1.5" style={{ color: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>Documento</span>
            <div className="aspect-square rounded-xl overflow-hidden" style={{ background: 'var(--color-paper-2)', border: '1px solid rgba(26,22,18,0.06)' }}>
              {documentUrl && <img src={documentUrl} className="w-full h-full object-cover" alt="Documento" />}
            </div>
          </div>
        </div>

        <div className="alert-card alert-info">
          <ShieldCheck size={18} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: 'var(--color-sage)' }} />
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>Receita e documento foram verificados. Sua doação alcança quem realmente precisa.</p>
        </div>
      </div>

      <div className="px-5 py-4 space-y-3 safe-bottom" style={{ borderTop: '1px solid rgba(26,22,18,0.08)' }}>
        {request.status === 'adopted' ? (
          <>
            <div className="text-center py-3 rounded-xl" style={{ background: 'var(--color-sage-bg)' }}>
              <span className="status-pill status-adopted">Apadrinhado</span>
              <p className="text-sm mt-1.5" style={{ color: 'var(--color-sage)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>Aguardando entrega das lentes.</p>
            </div>
            <button onClick={onShowQR} className="btn-sage w-full"><QrCode size={16} strokeWidth={1.8} /> QR de recebimento</button>
          </>
        ) : (
          <button onClick={() => { if (user) onAdopt(request.id, user.id); }} className="btn-sage w-full"><HandHeart size={16} strokeWidth={1.8} /> Apadrinhar — comprar as lentes</button>
        )}
        <button onClick={onClose} className="btn-ghost w-full">Voltar</button>
      </div>
    </motion.div>
  );
}
