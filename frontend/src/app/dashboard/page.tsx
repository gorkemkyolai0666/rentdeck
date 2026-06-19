'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AlpineNavLayout } from '@/components/alpine-nav-layout';
import {
  formatDateTime,
  getSkillLevelLabel,
  getTuneJobTypeLabel,
  getTuneJobStatusBadgeClass,
  getTuneJobStatusLabel,
} from '@/lib/utils';

interface Renter {
  id: string;
  fullName: string;
  phone: string;
  bootSize?: string;
  skillLevel?: string;
}

interface TuneJob {
  id: string;
  scheduledAt: string;
  type: string;
  status: string;
  renter?: Renter;
}

interface DashboardStats {
  totalRenters: number;
  todayTuneJobs: number;
  activeRentals: number;
  overdueRentals: number;
  maintenanceEquipment: number;
  upcomingTuneJobs?: TuneJob[];
  recentRenters?: Renter[];
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api
        .dashboardStats()
        .then(setStats)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>
          Yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <AlpineNavLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Merhaba, {user.firstName}
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
          Kayak dükkanınızın güncel durumu
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl mb-6 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 rounded w-20 mb-3" style={{ background: 'var(--border-color)' }} />
              <div className="h-8 rounded w-12" style={{ background: 'var(--border-color)' }} />
            </div>
          ))}
        </div>
      ) : (
        stats && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              <div className="stat-card">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Toplam Kiracı
                </span>
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.totalRenters}
                </span>
              </div>
              <div className="stat-card">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Bugünkü Bakım
                </span>
                <span className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                  {stats.todayTuneJobs}
                </span>
              </div>
              <div className="stat-card">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Aktif Kiralama
                </span>
                <span className="text-3xl font-bold" style={{ color: 'var(--success)' }}>
                  {stats.activeRentals}
                </span>
              </div>
              <div className="stat-card">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Gecikmiş
                </span>
                <span className="text-3xl font-bold" style={{ color: 'var(--danger)' }}>
                  {stats.overdueRentals}
                </span>
              </div>
              <div className="stat-card">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Bakımdaki Ekipman
                </span>
                <span className="text-3xl font-bold" style={{ color: 'var(--warning)' }}>
                  {stats.maintenanceEquipment}
                </span>
              </div>
              <div className="stat-card">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Yaklaşan Bakım
                </span>
                <span className="text-3xl font-bold" style={{ color: 'var(--info)' }}>
                  {stats.upcomingTuneJobs?.length ?? 0}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Yaklaşan Bakım İşleri
                  </h2>
                  <Link href="/tune-jobs" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                    Tümü
                  </Link>
                </div>
                {!stats.upcomingTuneJobs?.length ? (
                  <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                    Yaklaşan bakım işi bulunmuyor
                  </p>
                ) : (
                  <div className="space-y-3">
                    {stats.upcomingTuneJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-3 rounded-xl border"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <div>
                          <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            {job.renter?.fullName || '—'}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {getTuneJobTypeLabel(job.type)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                            {formatDateTime(job.scheduledAt)}
                          </div>
                          <span className={getTuneJobStatusBadgeClass(job.status)}>
                            {getTuneJobStatusLabel(job.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Son Kiracılar
                  </h2>
                  <Link href="/renters" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                    Tümü
                  </Link>
                </div>
                {!stats.recentRenters?.length ? (
                  <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                    Henüz kiracı kaydı bulunmuyor
                  </p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentRenters.map((renter) => (
                      <div
                        key={renter.id}
                        className="flex items-center justify-between p-3 rounded-xl border"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <div>
                          <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            {renter.fullName}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {renter.phone}
                            {renter.bootSize ? ` · Bot ${renter.bootSize}` : ''}
                          </div>
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {renter.skillLevel ? getSkillLevelLabel(renter.skillLevel) : '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )
      )}
    </AlpineNavLayout>
  );
}
