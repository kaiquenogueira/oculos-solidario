import { useState } from 'react';
import { motion } from 'motion/react';
import { createClient } from '../lib/supabase/client';

export function LoginView() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage('');
    setError(false);

    const { error: authErr } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
      }
    });

    if (authErr) {
      setMessage(authErr.message);
      setError(true);
    } else {
      setMessage('Link enviado. Verifique sua caixa de entrada.');
      setError(false);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen relative paper-grain" style={{ background: 'var(--color-paper)' }}>
      {/* Top masthead */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between relative z-10">
        <span className="kicker">Edição N.º 01 · 2026</span>
        <span className="kicker">São Paulo · Brasil</span>
      </header>

      <div className="rule-strong mx-6"></div>

      {/* Cover */}
      <main className="flex-1 px-6 pt-8 pb-6 flex flex-col relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="flex items-baseline gap-3 mb-2">
            <span className="numeral text-[11px]" style={{ color: 'var(--color-rust)' }}>01 ——</span>
            <span className="kicker kicker-rust">o periódico da visão solidária</span>
          </div>

          <h1 className="serif-display text-[64px] mt-3" style={{ color: 'var(--color-ink)' }}>
            Óculos<br/>
            <span className="italic" style={{ color: 'var(--color-rust)', fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>Solidá<span style={{ letterSpacing: '-0.06em' }}>ri</span>os</span>
          </h1>

          <p className="font-display text-xl leading-snug mt-6 max-w-[88%]" style={{ color: 'var(--color-ink-2)' }}>
            Um catálogo vivo de gestos. Quem vê de sobra, doa.<br/>
            <span className="italic" style={{ color: 'var(--color-ink-3)' }}>Quem precisa enxergar, recebe.</span>
          </p>
        </motion.div>

        {/* Decorative spectacle SVG */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="my-10 flex justify-center"
          aria-hidden
        >
          <svg width="220" height="80" viewBox="0 0 220 80" fill="none">
            <ellipse cx="55" cy="40" rx="38" ry="28" stroke="var(--color-ink)" strokeWidth="1.5" />
            <ellipse cx="165" cy="40" rx="38" ry="28" stroke="var(--color-ink)" strokeWidth="1.5" />
            <path d="M93 40 Q110 28 127 40" stroke="var(--color-ink)" strokeWidth="1.5" fill="none" />
            <path d="M17 35 L4 30" stroke="var(--color-ink)" strokeWidth="1.5" />
            <path d="M203 35 L216 30" stroke="var(--color-ink)" strokeWidth="1.5" />
            <ellipse cx="55" cy="40" rx="34" ry="24" stroke="var(--color-rust)" strokeWidth="0.5" opacity="0.5" />
            <ellipse cx="165" cy="40" rx="34" ry="24" stroke="var(--color-rust)" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleMagicLink}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="space-y-5"
        >
          <div>
            <label className="kicker block mb-2">Endereço eletrônico</label>
            <input
              type="email"
              placeholder="seu nome @ correio"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="field-paper w-full"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-ink w-full">
            {loading ? 'Enviando…' : 'Receber link mágico'}
            {!loading && <span aria-hidden>→</span>}
          </button>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[11px] tracking-wider uppercase pt-1"
              style={{ color: error ? 'var(--color-rust)' : 'var(--color-sage)' }}
            >
              {error ? '✕ ' : '✓ '}{message}
            </motion.p>
          )}
        </motion.form>

        <div className="my-7 flex items-center gap-4">
          <div className="flex-1 rule-strong"></div>
          <span className="kicker">ou</span>
          <div className="flex-1 rule-strong"></div>
        </div>

        <button onClick={handleGoogleLogin} className="btn-ghost w-full">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar com Google
        </button>
      </main>

      {/* Colofon */}
      <footer className="px-6 pb-8 pt-4 relative z-10">
        <div className="rule mb-4"></div>
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] leading-snug max-w-[60%]" style={{ color: 'var(--color-ink-3)' }}>
            Apenas óculos de grau. Itens fora da curadoria são removidos sem aviso.
          </p>
          <span className="numeral text-[10px]" style={{ color: 'var(--color-ink-3)' }}>p. 01 / ∞</span>
        </div>
      </footer>
    </div>
  );
}
