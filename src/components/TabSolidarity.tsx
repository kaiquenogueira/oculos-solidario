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
    <div className="px-6 pt-10 pb-28">
      {/* Header */}
      <header className="mb-5">
        <span className="kicker kicker-sage">Caderno solidário</span>
        <h1 className="serif-display text-[44px] mt-1" style={{ color: 'var(--color-ink)' }}>
          <span className="italic" style={{ color: 'var(--color-sage)' }}>Apadrinhe</span><br/>uma visão.
        </h1>
        <p className="font-display italic text-base mt-3 max-w-[90%]" style={{ color: 'var(--color-ink-3)' }}>
          Há quem tenha a armação mas não as lentes. Há quem possa custear as lentes mas nunca pediu o endereço.
        </p>
      </header>

      <div className="rule-double mb-6"></div>

      {/* Manifesto card */}
      <section
        className="relative overflow-hidden p-7 mb-8 grain-overlay"
        style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
      >
        <div className="flex items-baseline gap-3 mb-3 relative z-10">
          <span className="numeral text-[10px]" style={{ color: 'var(--color-sage-soft)' }}>§ 01</span>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: 'var(--color-sage-soft)' }}>
            O contrato
          </span>
        </div>
        <p
          className="font-display text-[24px] leading-tight relative z-10"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1' }}
        >
          Ao adotar um pedido, o padrinho compromete-se a <span className="italic" style={{ color: 'var(--color-sage-soft)' }}>custear as lentes</span> conforme a receita médica apresentada.
        </p>
        <p className="font-display italic text-sm mt-4 relative z-10" style={{ color: 'var(--color-paper-3)', opacity: 0.75 }}>
          A entrega é confirmada por leitura de QR Code — sem burocracia, sem rastros desnecessários.
        </p>

        <span
          className="absolute -right-2 -bottom-2 eye-mark text-[120px] opacity-15"
          style={{ color: 'var(--color-sage-soft)' }}
          aria-hidden
        >
          ♡
        </span>
      </section>

      {/* List header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="numeral text-[11px]" style={{ color: 'var(--color-sage)' }}>§ 02</span>
          <h3 className="serif-display text-[26px] mt-1" style={{ color: 'var(--color-ink)' }}>
            Pedidos <span className="italic">em aberto</span>
          </h3>
        </div>
        <button
          onClick={onOpenNewRequestForm}
          className="font-mono text-[10px] tracking-[0.2em] uppercase inline-flex items-center gap-1.5 pb-0.5"
          style={{ color: 'var(--color-sage)', borderBottom: '1px solid var(--color-sage)' }}
        >
          <Plus size={12} strokeWidth={1.8} /> Pedir ajuda
        </button>
      </div>

      <div className="space-y-5">
        {prescriptionRequests.length === 0 ? (
          <div className="hairline p-10 text-center" style={{ background: 'var(--color-paper-2)' }}>
            <span className="eye-mark text-[42px]" style={{ color: 'var(--color-ink-4)' }}>—∅—</span>
            <p className="font-display italic mt-3" style={{ color: 'var(--color-ink-3)' }}>
              Nenhum pedido neste momento.
            </p>
          </div>
        ) : (
          prescriptionRequests.map((req, i) => (
            <motion.button
              key={req.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectRequest(req)}
              className="w-full text-left relative paper-edge p-5 grain-overlay"
              style={{ background: 'var(--color-paper)' }}
            >
              {/* Index marker */}
              <div className="flex items-baseline justify-between mb-2">
                <span className="numeral text-[10px]" style={{ color: 'var(--color-ink-4)' }}>
                  N.º {String(i + 1).padStart(3, '0')}
                </span>
                {req.status === 'adopted' ? (
                  <span className="tag-sage">✓ Apadrinhado</span>
                ) : (
                  <span className="tag-mono" style={{ color: 'var(--color-rust)', borderColor: 'var(--color-rust)' }}>
                    ◌ aberto
                  </span>
                )}
              </div>

              <h4 className="serif-display text-[24px] leading-tight" style={{ color: 'var(--color-ink)' }}>
                {req.patientName}
              </h4>

              <div className="flex items-center gap-3 mt-1">
                <span className="kicker flex items-center gap-1">
                  <MapPin size={9} strokeWidth={1.5} />
                  {req.neighborhood}, {req.city}
                </span>
              </div>

              <div className="rule my-3"></div>

              <p className="font-display italic text-[15px] leading-relaxed line-clamp-3" style={{ color: 'var(--color-ink-2)' }}>
                "{req.description}"
              </p>

              <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px dashed rgba(26,22,18,0.18)' }}>
                <div>
                  <span className="kicker block">Receita resumida</span>
                  <span className="font-mono text-[13px] mt-0.5 block" style={{ color: 'var(--color-sage)' }}>
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
