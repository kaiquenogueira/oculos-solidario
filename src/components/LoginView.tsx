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
      setMessage('Link enviado! Verifique sua caixa de entrada.');
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
    <div className="flex flex-col min-h-screen relative" style={{ background: 'var(--color-paper)' }}>
      {/* Background gradient orb */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(192,57,26,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-40 left-0 w-60 h-60 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(58,130,54,0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden
      />

      {/* Top header */}
      <header className="px-6 safe-top pt-6 pb-3 flex items-center justify-between relative z-10">
        <span className="kicker" style={{ fontSize: '11px' }}>Edição N.º 01 · 2026</span>
        <span className="kicker" style={{ fontSize: '11px' }}>São Paulo · Brasil</span>
      </header>

      <div className="rule-strong mx-6" />

      {/* Main content */}
      <main className="flex-1 px-6 pt-8 pb-6 flex flex-col relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-1 rounded-full"
              style={{ background: 'var(--color-rust)' }}
            />
            <span className="kicker kicker-rust" style={{ fontSize: '11px' }}>O periódico da visão solidária</span>
          </div>

          <h1 className="serif-display mt-2" style={{ fontSize: '52px', color: 'var(--color-ink)', lineHeight: 0.95 }}>
            Óculos<br/>
            <span className="italic" style={{ color: 'var(--color-rust)', fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>Solidá<span style={{ letterSpacing: '-0.06em' }}>ri</span>os</span>
          </h1>

          <p className="text-base leading-relaxed mt-5 max-w-[90%]" style={{ color: 'var(--color-ink-2)', fontFamily: 'var(--font-display)' }}>
            Um catálogo vivo de gestos. Quem vê de sobra, doa.{' '}
            <span className="italic" style={{ color: 'var(--color-ink-3)' }}>Quem precisa enxergar, recebe.</span>
          </p>
        </motion.div>

        {/* Hero glasses image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="my-6 flex justify-center"
          aria-hidden
        >
          <div className="w-48 h-48 rounded-3xl overflow-hidden" style={{ boxShadow: '0 8px 32px -8px rgba(26,22,18,0.15)' }}>
            <img src="/images/hero-glasses.png" alt="" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleMagicLink}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="space-y-4"
        >
          <div>
            <label className="kicker block mb-2" style={{ fontSize: '11px' }}>Endereço eletrônico</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="field-paper w-full"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-ink w-full">
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent" style={{ animation: 'spin 0.6s linear infinite' }} />
                Enviando…
              </>
            ) : (
              <>Receber link mágico <span aria-hidden>→</span></>
            )}
          </button>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert-card"
              style={{
                background: error ? 'var(--color-rust-bg)' : 'var(--color-sage-bg)',
                border: error ? '1px solid rgba(192,57,26,0.2)' : '1px solid rgba(58,130,54,0.15)',
              }}
            >
              <span style={{ fontSize: '14px' }}>{error ? '✕' : '✓'}</span>
              <p className="text-sm" style={{ color: error ? 'var(--color-rust)' : 'var(--color-sage)' }}>
                {message}
              </p>
            </motion.div>
          )}
        </motion.form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 rule-strong" />
          <span className="kicker" style={{ fontSize: '11px' }}>ou</span>
          <div className="flex-1 rule-strong" />
        </div>

        <button onClick={handleGoogleLogin} className="btn-ghost w-full">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar com Google
        </button>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-6 pt-4 safe-bottom relative z-10">
        <div className="rule mb-4" />
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs leading-relaxed max-w-[65%]" style={{ color: 'var(--color-ink-3)' }}>
            Apenas óculos de grau. Itens fora da curadoria são removidos sem aviso.
          </p>
          <span className="numeral text-xs" style={{ color: 'var(--color-ink-4)' }}>p. 01 / ∞</span>
        </div>
      </footer>
    </div>
  );
}
