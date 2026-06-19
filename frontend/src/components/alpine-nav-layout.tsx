'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Mountain,
  Package,
  ClipboardList,
  Wrench,
  Moon,
  Sun,
  LogOut,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/renters', label: 'Kiracılar', icon: Users },
  { href: '/equipment', label: 'Ekipman', icon: Mountain },
  { href: '/rental-packages', label: 'Paketler', icon: Package },
  { href: '/rentals', label: 'Kiralamalar', icon: ClipboardList },
  { href: '/tune-jobs', label: 'Bakım', icon: Wrench },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function AlpineNavLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col pb-[72px] md:pb-0">
      <header
        className="sticky top-0 z-40 border-b"
        style={{ background: 'var(--bg-nav)', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-lg shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--ice-blue-dark), var(--ice-blue))',
                  color: 'white',
                }}
              >
                R
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-lg font-bold leading-tight" style={{ color: 'var(--text-nav)' }}>
                  RentDeck
                </div>
                <div className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-nav-muted)' }}>
                  Kayak Kiralama
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center max-w-3xl">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn('px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap')}
                    style={{
                      background: active ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                      color: active ? 'var(--ice-blue)' : 'var(--text-nav-muted)',
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className="hidden lg:inline text-xs truncate max-w-[140px]"
                style={{ color: 'var(--text-nav-muted)' }}
              >
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={toggle}
                className="p-2 rounded-xl transition-colors"
                style={{ color: 'var(--text-nav-muted)' }}
                aria-label="Tema değiştir"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors"
                style={{ color: 'var(--danger)' }}
              >
                <LogOut size={14} />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6">{children}</main>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t flex justify-around py-2 safe-area-pb"
        style={{ background: 'var(--bg-nav)', borderColor: 'rgba(255,255,255,0.08)' }}
        aria-label="Ana navigasyon"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-2 py-1 min-w-[52px]"
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} style={{ color: active ? 'var(--ice-blue)' : 'var(--text-nav-muted)' }} />
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? 'var(--ice-blue)' : 'var(--text-nav-muted)' }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
