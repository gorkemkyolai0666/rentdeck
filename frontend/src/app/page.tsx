'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Mountain, Users, Wrench, Snowflake } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>
          Yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <header
        className="sticky top-0 z-30 backdrop-blur-md border-b"
        style={{ background: 'var(--glass)', borderColor: 'var(--border-color)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--ice-blue-dark), var(--ice-blue))',
                color: 'white',
              }}
            >
              R
            </div>
            <div>
              <span className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                RentDeck
              </span>
              <p className="text-[10px] tracking-widest uppercase leading-none" style={{ color: 'var(--text-muted)' }}>
                Kayak Kiralama SaaS
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm hidden sm:inline-flex px-4 py-2 rounded-xl font-medium border transition-colors"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              Giriş Yap
            </Link>
            <Link href="/register" className="btn-primary text-sm">
              Kayıt Ol
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden alpine-gradient">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(ellipse at 80% 20%, rgba(56, 189, 248, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
            }}
          />
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.3em] uppercase mb-6 font-medium flex items-center gap-2" style={{ color: 'var(--ice-blue)' }}>
                <Snowflake size={14} />
                Uludağ Kayak Kiralama SaaS
              </p>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-8" style={{ color: 'var(--glacier)' }}>
                Piste hazır,
                <br />
                <span style={{ color: 'var(--ice-blue)' }}>işletmeniz hazır</span>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-lg" style={{ color: 'var(--glacier-dark)' }}>
                Kiracı kayıtlarından ekipman envanterine, kiralama paketlerinden wax &amp; tune bakım işlerine — kayak dükkanınızın tüm operasyonunu tek platformda yönetin.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn-primary px-8 py-3 text-base">
                  Dükkanını Aç
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 text-base rounded-xl font-medium border transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'var(--glacier)' }}
                >
                  Demo Hesap
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  icon: Users,
                  title: 'Kiracı Yönetimi',
                  desc: 'Bot numarası, seviye ve iletişim bilgileriyle müşterilerinizi hızlıca kaydedin ve takip edin.',
                },
                {
                  icon: Mountain,
                  title: 'Ekipman Envanteri',
                  desc: 'Kayak, snowboard, bot ve aksesuarları durum, beden ve günlük fiyat bilgisiyle yönetin.',
                },
                {
                  icon: Wrench,
                  title: 'Bakım & Tune',
                  desc: 'Mum, kenar bileme ve tam bakım işlerini planlayın; teknisyen ataması yapın.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title}>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--ice-blue-dark)' }}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>
                    <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {item.desc}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="rounded-2xl p-10 md:p-16 text-center alpine-gradient">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--glacier)' }}>
              Kayak dükkanınızı dijitalleştirmeye hazır mısınız?
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--glacier-dark)' }}>
              Ücretsiz kayıt olun ve kiralama operasyonunuzu dakikalar içinde yönetmeye başlayın.
            </p>
            <Link href="/register" className="btn-primary inline-block px-10 py-3">
              Hemen Başlayın
            </Link>
          </div>
        </section>
      </main>

      <footer
        className="border-t py-8 text-center text-sm"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
      >
        RentDeck &copy; 2026 — Kayak &amp; snowboard kiralama yönetim platformu
      </footer>
    </div>
  );
}
