import { Search, SlidersHorizontal } from 'lucide-react';

interface TabSearchProps {
  onGoToSolidarity: () => void;
}

const filters = [
  { label: 'Tudo',      glyph: '∗', active: true },
  { label: 'Doação',    glyph: '◆' },
  { label: 'Troca',     glyph: '◇' },
  { label: 'Masculino', glyph: '♂' },
  { label: 'Feminino',  glyph: '♀' },
  { label: 'Infantil',  glyph: '✦' },
];

export function TabSearch({ onGoToSolidarity }: TabSearchProps) {
  return (
    <div className="px-5 safe-top pt-4 pb-32">
      {/* Header */}
      <header className="mb-5">
        <div className="flex items-end justify-between">
          <div>
            <span className="kicker">Índice · Procura</span>
            <h1 className="serif-display text-4xl mt-1" style={{ color: 'var(--color-ink)' }}>
              <span className="italic" style={{ color: 'var(--color-rust)' }}>O</span> que<br/>buscamos
            </h1>
          </div>
          <button
            className="w-11 h-11 flex items-center justify-center rounded-full"
            style={{ background: 'var(--color-paper-2)' }}
            aria-label="Filtros"
          >
            <SlidersHorizontal size={18} strokeWidth={1.5} style={{ color: 'var(--color-ink)' }} />
          </button>
        </div>
      </header>

      {/* Search field */}
      <div className="mb-6">
        <div
          className="flex items-center gap-3 px-4 rounded-2xl"
          style={{
            background: 'var(--color-paper-2)',
            minHeight: '52px',
          }}
        >
          <Search size={18} strokeWidth={1.5} style={{ color: 'var(--color-ink-3)' }} />
          <input
            placeholder="óculos, grau, cidade…"
            className="flex-1 bg-transparent outline-none text-base"
            style={{
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '16px',
            }}
          />
        </div>
      </div>

      {/* Solidarity callout */}
      <section
        className="relative overflow-hidden p-5 mb-6 rounded-2xl grain-overlay"
        style={{ background: 'var(--color-sage)', color: 'var(--color-paper)' }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-0.5 rounded-full" style={{ background: 'var(--color-sage-soft)' }} />
            <span
              className="text-xs tracking-wider uppercase font-medium"
              style={{ color: 'var(--color-sage-soft)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}
            >
              Programa Padrinho Visual
            </span>
          </div>
          <h2
            className="font-display text-2xl leading-tight"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1' }}
          >
            Tem a armação,<br/>
            <span className="italic">faltam-lhe as lentes?</span>
          </h2>
          <p className="text-sm mt-3 max-w-[90%] opacity-85" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
            A rede solidária recebe sua receita médica e conecta você a um padrinho disposto a custear as lentes.
          </p>
          <button
            onClick={onGoToSolidarity}
            className="mt-4 inline-flex items-center gap-2 text-xs tracking-wider uppercase py-2.5 px-4 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.18)',
              color: 'var(--color-paper)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
            }}
          >
            Conhecer o programa →
          </button>
        </div>

        <span
          className="absolute -right-3 -bottom-4 eye-mark opacity-10"
          aria-hidden
          style={{ color: 'var(--color-paper)', fontSize: '100px' }}
        >
          §
        </span>
      </section>

      {/* Filter chips */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-0.5 rounded-full" style={{ background: 'var(--color-rust)' }} />
          <span className="kicker" style={{ fontSize: '11px' }}>Filtragem rápida</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.label}
              className="shrink-0 tag-mono inline-flex items-center gap-1.5 transition-colors min-h-[38px]"
              style={f.active ? { background: 'var(--color-ink)', color: 'var(--color-paper)', borderColor: 'var(--color-ink)' } : undefined}
            >
              <span aria-hidden>{f.glyph}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty — eye chart */}
      <div className="text-center">
        <div className="rounded-2xl py-10 px-6" style={{ background: 'var(--color-paper-2)' }}>
          <p className="kicker mb-4 text-xs">— quadro de visão —</p>
          <p className="eye-mark tracking-wider" style={{ color: 'var(--color-ink)', fontSize: '48px' }}>F P</p>
          <p className="eye-mark mt-2 tracking-wider" style={{ color: 'var(--color-ink-2)', fontSize: '36px' }}>T O Z</p>
          <p className="eye-mark mt-2 tracking-wider" style={{ color: 'var(--color-ink-3)', fontSize: '24px' }}>L P E D</p>
          <p className="eye-mark mt-2 tracking-wider" style={{ color: 'var(--color-ink-4)', fontSize: '16px' }}>P E C F D</p>
          <p className="text-sm mt-6 leading-relaxed" style={{ color: 'var(--color-ink-3)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
            Use os filtros acima para encontrar<br/>óculos para sua necessidade.
          </p>
        </div>
      </div>
    </div>
  );
}
