'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AlpineNavLayout } from '@/components/alpine-nav-layout';
import { getSkillLevelLabel } from '@/lib/utils';
import { Pencil, Trash2, X, Check } from 'lucide-react';

interface Renter {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  bootSize?: string;
  skillLevel?: string;
  notes?: string;
}

const emptyForm = {
  fullName: '',
  phone: '',
  email: '',
  bootSize: '',
  skillLevel: 'intermediate',
  notes: '',
};

const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

export default function RentersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [renters, setRenters] = useState<Renter[]>([]);
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

  const loadRenters = () => {
    setLoading(true);
    api
      .getRenters()
      .then(setRenters)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) loadRenters();
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
    try {
      if (editingId) {
        await api.updateRenter(editingId, form);
      } else {
        await api.createRenter(form);
      }
      resetForm();
      loadRenters();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (renter: Renter) => {
    setEditingId(renter.id);
    setForm({
      fullName: renter.fullName,
      phone: renter.phone,
      email: renter.email || '',
      bootSize: renter.bootSize || '',
      skillLevel: renter.skillLevel || 'intermediate',
      notes: renter.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kiracıyı silmek istediğinize emin misiniz?')) return;
    setError('');
    try {
      await api.deleteRenter(id);
      loadRenters();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const filtered = renters.filter((r) =>
    `${r.fullName} ${r.phone} ${r.email || ''} ${r.bootSize || ''} ${r.notes || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
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
            Kiracılar
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
            {renters.length} kayıtlı kiracı
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
          {showForm && !editingId ? 'İptal' : 'Yeni Kiracı'}
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
              {editingId ? 'Kiracı Düzenle' : 'Yeni Kiracı'}
            </h2>
            <button onClick={resetForm} className="p-1 rounded-lg" style={{ color: 'var(--text-muted)' }} aria-label="Kapat">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Ad Soyad *
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Telefon *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                E-posta
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Bot Numarası
              </label>
              <input
                type="text"
                value={form.bootSize}
                onChange={(e) => setForm({ ...form, bootSize: e.target.value })}
                className="input-field"
                placeholder="Örn: 42"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Seviye
              </label>
              <select
                value={form.skillLevel}
                onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}
                className="input-field"
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {getSkillLevelLabel(level)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Notlar
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field"
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
        placeholder="Kiracı ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4 max-w-md"
        aria-label="Kiracı ara"
      />

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>
          Yükleniyor...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          {search ? 'Aramanızla eşleşen kiracı bulunamadı' : 'Henüz kiracı kaydı bulunmuyor'}
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <th className="text-left p-4 font-medium" style={{ color: 'var(--text-muted)' }}>
                    Ad Soyad
                  </th>
                  <th className="text-left p-4 font-medium hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>
                    Telefon
                  </th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>
                    Bot
                  </th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>
                    Seviye
                  </th>
                  <th className="text-right p-4 font-medium" style={{ color: 'var(--text-muted)' }}>
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((renter) => (
                  <tr key={renter.id} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                    <td className="p-4">
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {renter.fullName}
                      </div>
                      <div className="text-xs md:hidden" style={{ color: 'var(--text-muted)' }}>
                        {renter.phone}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>
                      {renter.phone}
                    </td>
                    <td className="p-4 hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>
                      {renter.bootSize || '—'}
                    </td>
                    <td className="p-4 hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>
                      {renter.skillLevel ? getSkillLevelLabel(renter.skillLevel) : '—'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(renter)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--accent)' }}
                          aria-label="Düzenle"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(renter.id)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--danger)' }}
                          aria-label="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AlpineNavLayout>
  );
}
