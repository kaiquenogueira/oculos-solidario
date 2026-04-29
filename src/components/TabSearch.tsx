import { Search, SlidersHorizontal } from 'lucide-react';

interface TabSearchProps {
  onGoToSolidarity: () => void;
}

const filters = [
  { label: 'Tudo',      glyph: '∗' },
  { label: 'Doação',    glyph: '◆' },
  { label: 'Troca',     glyph: '◇' },
  { label: 'Masculino', glyph: '♂' },
  { label: 'Feminino',  glyph: '♀' },
  { label: 'Infantil',  glyph: '✦' },
];

export function TabSearch({ onGoToSolidarity }: TabSearchProps) {
  return (
    <div className="px-6 pt-10 pb-28">
      {/* Header */}
      <header className="mb-6">
        <span className="kicker">Índice — Procura</span>
        <div className="flex items-end justify-between mt-1">
          <h1 className="serif-display text-[44px]" style={{ color: 'var(--color-ink)' }}>
            <span className="italic" style={{ color: 'var(--color-rust)' }}>O</span> que<br/>buscamos
          </h1>
          <button className="hairline w-10 h-10 flex items-center justify-center" aria-label="Filtros">
            <SlidersHorizontal size={16} strokeWidth={1.5} style={{ color: 'var(--color-ink)' }} />
          </button>
        </div>
      </header>

      <div className="rule-double mb-6"></div>

      {/* Search field — newspaper style */}
      <div className="relative mb-7">
        <span className="kicker block mb-2">— pesquisar —</span>
        <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '1px solid var(--color-ink)' }}>
          <Search size={18} strokeWidth={1.5} style={{ color: 'var(--color-ink)' }} />
          <input
            placeholder="óculos, grau, cidade…"
            className="flex-1 bg-transparent outline-none font-display text-[19px] italic placeholder:opacity-60"
            style={{ color: 'var(--color-ink)' }}
          />
          <span className="numeral text-[10px]" style={{ color: 'var(--color-ink-4)' }}>↵</span>
        </div>
      </div>

      {/* Solidarity callout — sage */}
      <section
        className="relative overflow-hidden p-6 mb-7 grain-overlay"
        style={{ background: 'var(--color-sage)', color: 'var(--color-paper)' }}
      >
        <div className="flex items-baseline gap-3 mb-3 relative z-10">
          <span className="numeral text-[10px]" style={{ color: 'var(--color-paper-3)', opacity: 0.8 }}>§ 04</span>
          <span
            className="font-mono text-[10px] tracking-[0.22em] uppercase"
            style={{ color: 'var(--color-paper-3)' }}
          >
            Programa Padrinho Visual
          </span>
        </div>
        <h2
          className="font-display text-[26px] leading-tight relative z-10"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1' }}
        >
          Tem a armação,<br/>
          <span className="italic">faltam-lhe as lentes?</span>
        </h2>
        <p className="font-display italic text-sm mt-3 max-w-[88%] relative z-10" style={{ color: 'var(--color-paper-2)', opacity: 0.85 }}>
          A rede solidária recebe sua receita médica e conecta você a um padrinho disposto a custear as lentes.
        </p>
        <button
          onClick={onGoToSolidarity}
          className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase pb-1 relative z-10"
          style={{ color: 'var(--color-paper)', borderBottom: '1px solid var(--color-paper)' }}
        >
          Conhecer o programa →
        </button>

        {/* Decorative serif "S" */}
        <span
          className="absolute -right-3 -bottom-6 eye-mark text-[140px] opacity-10"
          aria-hidden
          style={{ color: 'var(--color-paper)' }}
        >
          §
        </span>
      </section>

      {/* Filter row */}
      <div className="flex items-baseline gap-3 mb-3">
        <span className="numeral text-[11px]" style={{ color: 'var(--color-rust)' }}>§ 05</span>
        <span className="kicker">Filtragem rápida</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((f, i) => (
          <button
            key={f.label}
            className="shrink-0 tag-mono inline-flex items-center gap-1.5 hover:!bg-[var(--color-ink)] hover:!text-[var(--color-paper)] transition-colors"
            style={i === 0 ? { background: 'var(--color-ink)', color: 'var(--color-paper)', borderColor: 'var(--color-ink)' } : undefined}
          >
            <span aria-hidden>{f.glyph}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Empty illustration — eye chart */}
      <div className="mt-12 text-center pb-4">
        <div className="hairline py-10 px-6" style={{ background: 'var(--color-paper-2)' }}>
          <p className="kicker mb-4">— quadro de visão —</p>
          <p className="eye-mark text-[58px] tracking-[0.05em]" style={{ color: 'var(--color-ink)' }}>F P</p>
          <p className="eye-mark text-[42px] mt-2 tracking-[0.08em]" style={{ color: 'var(--color-ink-2)' }}>T O Z</p>
          <p className="eye-mark text-[28px] mt-2 tracking-[0.12em]" style={{ color: 'var(--color-ink-3)' }}>L P E D</p>
          <p className="eye-mark text-[18px] mt-2 tracking-[0.15em]" style={{ color: 'var(--color-ink-4)' }}>P E C F D</p>
          <p className="font-display italic text-[15px] mt-6 leading-snug" style={{ color: 'var(--color-ink-3)' }}>
            Use os filtros acima para encontrar<br/>óculos para sua necessidade.
          </p>
        </div>
      </div>
    </div>
  );
}
