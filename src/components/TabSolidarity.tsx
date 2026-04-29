import { Plus, MapPin, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PrescriptionRequest } from '../store/useStore';

interface TabSolidarityProps {
  prescriptionRequests: PrescriptionRequest[];
  onSelectRequest: (request: PrescriptionRequest) => void;
  onOpenNewRequestForm: () => void;
}

export function TabSolidarity({ prescriptionRequests, onSelectRequest, onOpenNewRequestForm }: TabSolidarityProps) {
  return (
    <div className="px-5 safe-top pt-4 pb-32">
      {/* Header */}
      <header className="mb-5">
        <span className="kicker kicker-sage">Caderno solidário</span>
        <h1 className="serif-display text-4xl mt-1" style={{ color: 'var(--color-ink)' }}>
          <span className="italic" style={{ color: 'var(--color-sage)' }}>Apadrinhe</span><br/>uma visão.
        </h1>
        <p className="text-sm mt-3 max-w-[92%] leading-relaxed" style={{ color: 'var(--color-ink-3)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
          Há quem tenha a armação mas não as lentes. Há quem possa custear as lentes mas nunca pediu o endereço.
        </p>
      </header>

      {/* Manifesto card with image */}
      <section className="relative overflow-hidden mb-6 rounded-2xl" style={{ background: 'var(--color-ink)' }}>
        <div className="absolute inset-0">
          <img src="/images/solidarity-hero.png" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(24,20,15,0.5) 0%, rgba(24,20,15,0.9) 100%)' }} />
        </div>

        <div className="relative z-10 p-5" style={{ color: 'var(--color-paper)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-0.5 rounded-full" style={{ background: 'var(--color-sage-soft)' }} />
            <span className="text-xs tracking-wider uppercase font-medium" style={{ color: 'var(--color-sage-soft)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>O contrato</span>
          </div>
          <p className="font-display text-lg leading-snug" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1' }}>
            Ao adotar um pedido, o padrinho compromete-se a <span className="italic" style={{ color: 'var(--color-sage-soft)' }}>custear as lentes</span> conforme a receita médica apresentada.
          </p>
          <p className="text-xs mt-3 italic opacity-70" style={{ fontFamily: 'var(--font-display)' }}>
            A entrega é confirmada por leitura de QR Code — sem burocracia.
          </p>
        </div>
      </section>

      {/* List header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-0.5 rounded-full" style={{ background: 'var(--color-sage)' }} />
          <span className="kicker" style={{ fontSize: '11px' }}>Pedidos em aberto</span>
        </div>
        <button
          onClick={onOpenNewRequestForm}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
          style={{
            color: 'var(--color-sage)',
            background: 'var(--color-sage-bg)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
          }}
        >
          <Plus size={14} strokeWidth={2} /> Pedir ajuda
        </button>
      </div>

      <div className="space-y-4">
        {prescriptionRequests.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--color-paper-2)' }}>
            <span className="eye-mark text-4xl" style={{ color: 'var(--color-ink-4)' }}>—∅—</span>
            <p className="font-display italic mt-3 text-sm" style={{ color: 'var(--color-ink-3)' }}>
              Nenhum pedido neste momento.
            </p>
          </div>
        ) : (
          prescriptionRequests.map((req) => (
            <motion.button
              key={req.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRequest(req)}
              className="w-full text-left card-paper p-5"
            >
              {/* Status + ID */}
              <div className="flex items-center justify-between mb-3">
                <span className="numeral text-xs" style={{ color: 'var(--color-ink-4)' }}>
                  #{req.id.slice(0, 6).toUpperCase()}
                </span>
                {req.status === 'adopted' ? (
                  <span className="status-pill status-adopted">Apadrinhado</span>
                ) : (
                  <span className="status-pill status-open">Aberto</span>
                )}
              </div>

              <h4 className="serif-display text-xl leading-tight" style={{ color: 'var(--color-ink)' }}>
                {req.patientName}
              </h4>

              <div className="flex items-center gap-1.5 mt-1.5">
                <MapPin size={12} strokeWidth={1.5} style={{ color: 'var(--color-ink-4)' }} />
                <span className="text-xs" style={{ color: 'var(--color-ink-3)' }}>
                  {req.neighborhood}, {req.city}
                </span>
              </div>

              <div className="rule my-3" />

              <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                "{req.description}"
              </p>

              <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px dashed rgba(26,22,18,0.10)' }}>
                <div>
                  <span className="kicker text-xs" style={{ fontSize: '10px' }}>Receita resumida</span>
                  <span className="font-mono text-sm mt-0.5 block" style={{ color: 'var(--color-sage)' }}>
                    {req.prescriptionSummary || '—'}
                  </span>
                </div>
                <ArrowUpRight size={18} strokeWidth={1.5} style={{ color: 'var(--color-ink-3)' }} />
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
