'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Snowflake } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@uludagkayak.com');
    setPassword('demo123456');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden alpine-gradient">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.4) 0%, transparent 50%)',
          }}
        />
        <div className="max-w-md relative">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center font-display font-bold text-2xl mb-8 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--ice-blue-dark), var(--ice-blue))',
              color: 'white',
            }}
          >
            R
          </div>
          <h2 className="font-display text-4xl font-bold mb-4 leading-tight" style={{ color: 'var(--glacier)' }}>
            Kayak dükkanınızın dijital merkezi
          </h2>
          <p className="text-lg leading-relaxed flex items-start gap-2" style={{ color: 'var(--glacier-dark)' }}>
            <Snowflake size={20} className="shrink-0 mt-1" style={{ color: 'var(--ice-blue)' }} />
            Kiracılardan ekipmana, kiralama paketlerinden tune işlerine — RentDeck ile Uludağ&apos;daki dükkanınızı tek platformda yönetin.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8" style={{ background: 'var(--bg-primary)' }}>
        <div className="card w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 lg:hidden">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--ice-blue-dark), var(--ice-blue))',
                  color: 'white',
                }}
              >
                R
              </div>
              <span className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                RentDeck
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Giriş Yap
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              Kayak kiralama dükkanı hesabınıza giriş yapın
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="ornek@uludagkayak.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="En az 6 karakter"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>

            <button
              type="button"
              onClick={fillDemo}
              className="w-full px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              Demo Hesap Bilgilerini Doldur
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Hesabınız yok mu?{' '}
            <Link href="/register" className="font-medium" style={{ color: 'var(--accent)' }}>
              Kayıt Olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
