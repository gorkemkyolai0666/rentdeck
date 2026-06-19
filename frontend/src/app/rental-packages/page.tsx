'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AlpineNavLayout } from '@/components/alpine-nav-layout';
import { formatCurrency, getPackageDurationLabel } from '@/lib/utils';
import { Pencil, Trash2, X, Check } from 'lucide-react';

interface RentalPackage {
  id: string;
  name: string;
  duration: string;
  price: number;
  depositAmount: number;
  description?: string;
}

const emptyForm = {
  name: '',
  duration: 'full_day',
  price: '',
  depositAmount: '',
  description: '',
};

const durations = ['half_day', 'full_day', 'two_day', 'week', 'season'];

export default function RentalPackagesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState<RentalPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadPackages = () => {
    setLoading(true);
    api
      .getRentalPackages()
      .then(setPackages)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) loadPackages();
  }, [user]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      depositAmount: parseFloat(form.depositAmount) || 0,
    };
    try {
      if (editingId) {
        await api.updateRentalPackage(editingId, payload);
      } else {
        await api.createRentalPackage(payload);
      }
      resetForm();
      loadPackages();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (pkg: RentalPackage) => {
    setEditingId(pkg.id);
    setForm({
      name: pkg.name,
      duration: pkg.duration,
      price: String(pkg.price),
      depositAmount: String(pkg.depositAmount),
      description: pkg.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu paketi silmek istediğinize emin misiniz?')) return;
    setError('');
    try {
      await api.deleteRentalPackage(id);
      loadPackages();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const filtered = packages.filter((p) =>
    `${p.name} ${p.duration} ${p.description || ''}`.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Kiralama Paketleri
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
            {packages.length} kayıtlı paket
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm && !editingId) resetForm();
            else {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(!showForm);
            }
          }}
          className="btn-primary shrink-0"
        >
          {showForm && !editingId ? 'İptal' : 'Yeni Paket'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl mb-4 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {editingId ? 'Paket Düzenle' : 'Yeni Paket'}
            </h2>
            <button onClick={resetForm} className="p-1 rounded-lg" style={{ color: 'var(--text-muted)' }} aria-label="Kapat">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Paket Adı *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="Örn: Günlük Kayak Seti"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Süre *
              </label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="input-field"
              >
                {durations.map((d) => (
                  <option key={d} value={d}>
                    {getPackageDurationLabel(d)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Fiyat (₺) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Depozito (₺)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.depositAmount}
                onChange={(e) => setForm({ ...form, depositAmount: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Açıklama
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field"
                placeholder="Paket içeriği ve detaylar"
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                <Check size={16} />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <input
        type="search"
        placeholder="Paket ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4 max-w-md"
        aria-label="Paket ara"
      />

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>
          Yükleniyor...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          {search ? 'Aramanızla eşleşen paket bulunamadı' : 'Henüz kiralama paketi bulunmuyor'}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pkg) => (
            <div key={pkg.id} className="card">
              <div className="mb-3">
                <span className="badge-gold mb-2 inline-block">{getPackageDurationLabel(pkg.duration)}</span>
                <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {pkg.description}
                  </p>
                )}
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                  {formatCurrency(pkg.price)}
                </p>
                {pkg.depositAmount > 0 && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Depozito: {formatCurrency(pkg.depositAmount)}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(pkg)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                >
                  <Pencil size={14} />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm"
                  style={{ color: 'var(--danger)' }}
                  aria-label="Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AlpineNavLayout>
  );
}
