import { ArrowLeft, MapPin, QrCode, HandHeart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { PrescriptionRequest, User as UserType } from '../store/useStore';
import { createClient } from '../lib/supabase/client';
import { useEffect, useState } from 'react';

interface ModalPrescriptionDetailProps {
  request: PrescriptionRequest | null;
  onClose: () => void;
  user: UserType | null;
  onAdopt: (id: string, userId: string) => void;
  onShowQR: () => void;
}

export function ModalPrescriptionDetail({
  request, onClose, user, onAdopt, onShowQR
}: ModalPrescriptionDetailProps) {
  const supabase = createClient();
  const [prescriptionUrl, setPrescriptionUrl] = useState<string>('');
  const [documentUrl, setDocumentUrl] = useState<string>('');

  useEffect(() => {
    if (!request) return;
    const fetchUrls = async () => {
      if (request.prescriptionPhotoUrl) {
        const { data } = await supabase.storage.from('private-prescriptions')
          .createSignedUrl(request.prescriptionPhotoUrl, 60 * 60);
        if (data) setPrescriptionUrl(data.signedUrl);
      }
      if (request.documentPhotoUrl) {
        const { data } = await supabase.storage.from('private-prescriptions')
          .createSignedUrl(request.documentPhotoUrl, 60 * 60);
        if (data) setDocumentUrl(data.signedUrl);
      }
    };
    fetchUrls();
  }, [request]);

  if (!request) return null;
  const initials = (request.patientName || '?').split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute inset-0 z-50 flex flex-col paper-grain"
      style={{ background: 'var(--color-paper)' }}
    >
      <header
        className="px-5 pt-10 pb-4 flex items-center gap-3 relative z-10"
        style={{ background: 'var(--color-paper)', borderBottom: '1px solid rgba(26,22,18,0.18)' }}
      >
        <button onClick={onClose} className="p-1 -ml-1" aria-label="Voltar">
          <ArrowLeft size={18} strokeWidth={1.5} style={{ color: 'var(--color-ink)' }} />
        </button>
        <div className="flex-1">
          <span className="kicker kicker-sage">Caderno solidário</span>
          <h3 className="font-display text-[20px] leading-tight mt-0.5" style={{ color: 'var(--color-ink)' }}>
            Pedido N.º {request.id.slice(0, 6).toUpperCase()}
          </h3>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 relative z-10">
        {/* Patient identity */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className="optical-ring shrink-0 w-16 h-16 flex items-center justify-center"
            style={{ background: 'var(--color-sage)', color: 'var(--color-paper)' }}
          >
            <span className="font-display text-xl">{initials}</span>
          </div>
          <div className="flex-1 pt-1">
            <h2 className="serif-display text-[28px] leading-tight" style={{ color: 'var(--color-ink)' }}>
              {request.patientName}
            </h2>
            <span className="kicker flex items-center gap-1 mt-1">
              <MapPin size={10} strokeWidth={1.5} />
              {request.neighborhood}, {request.city}
            </span>
          </div>
        </div>

        <div className="rule-double mb-5"></div>

        {/* Prescription */}
        <div className="mb-6 p-5 hairline" style={{ background: 'var(--color-paper-2)' }}>
          <span className="kicker kicker-rust block mb-1">— Receita resumida —</span>
          <p className="font-mono text-[18px] mt-1" style={{ color: 'var(--color-rust)' }}>
            {request.prescriptionSummary || '—'}
          </p>
        </div>

        {/* Story */}
        <span className="kicker block mb-2">A história</span>
        <p className="font-display italic text-[17px] leading-relaxed mb-6" style={{ color: 'var(--color-ink-2)' }}>
          "{request.description}"
        </p>

        <div className="rule mb-5"></div>

        {/* Documents */}
        <span className="kicker block mb-3">— documentação verificada —</span>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase block mb-1.5" style={{ color: 'var(--color-ink-3)' }}>
              fig. 01 · receita
            </span>
            <div className="aspect-square hairline overflow-hidden" style={{ background: 'var(--color-paper-2)' }}>
              {prescriptionUrl && <img src={prescriptionUrl} className="w-full h-full object-cover" alt="Receita" />}
            </div>
          </div>
          <div>
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase block mb-1.5" style={{ color: 'var(--color-ink-3)' }}>
              fig. 02 · documento
            </span>
            <div className="aspect-square hairline overflow-hidden" style={{ background: 'var(--color-paper-2)' }}>
              {documentUrl && <img src={documentUrl} className="w-full h-full object-cover" alt="Documento" />}
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="p-4 flex items-start gap-3 grain-overlay relative" style={{ background: 'var(--color-sage)', color: 'var(--color-paper)' }}>
          <ShieldCheck size={16} strokeWidth={1.6} className="shrink-0 mt-0.5 relative z-10" />
          <p className="font-display italic text-[13px] leading-snug relative z-10">
            Receita e documento foram verificados pela curadoria. Sua doação alcança quem realmente precisa.
          </p>
        </div>
      </div>

      <div
        className="px-6 py-5 space-y-3"
        style={{ background: 'var(--color-paper)', borderTop: '1px solid rgba(26,22,18,0.18)' }}
      >
        {request.status === 'adopted' ? (
          <>
            <div className="px-4 py-3 text-center" style={{ background: 'var(--color-sage)', color: 'var(--color-paper)' }}>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase block">Pedido apadrinhado</span>
              <p className="font-display italic mt-1">Aguardando entrega das lentes.</p>
            </div>
            <button onClick={onShowQR} className="btn-sage w-full">
              <QrCode size={14} strokeWidth={1.8} />
              QR de recebimento
            </button>
          </>
        ) : (
          <button
            onClick={() => { if (user) onAdopt(request.id, user.id); }}
            className="btn-sage w-full"
          >
            <HandHeart size={14} strokeWidth={1.8} />
            Apadrinhar — comprar as lentes
          </button>
        )}
        <button onClick={onClose} className="btn-ghost w-full">
          Voltar
        </button>
      </div>
    </motion.div>
  );
}
