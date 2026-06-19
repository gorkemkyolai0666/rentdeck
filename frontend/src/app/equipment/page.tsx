'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AlpineNavLayout } from '@/components/alpine-nav-layout';
import {
  formatCurrency,
  getEquipmentTypeLabel,
  getEquipmentStatusLabel,
  getEquipmentStatusBadgeClass,
} from '@/lib/utils';
import { Pencil, Trash2, X, Check } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  type: string;
  brand?: string;
  size?: string;
  status: string;
  dailyRate: number;
  notes?: string;
}

const emptyForm = {
  name: '',
  type: 'ski',
  brand: '',
  size: '',
  status: 'available',
  dailyRate: '',
  notes: '',
};

const equipmentTypes = ['ski', 'snowboard', 'boots', 'helmet', 'poles', 'bindings'];
const equipmentStatuses = ['available', 'rented', 'maintenance', 'retired'];

export default function EquipmentPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
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

  const loadEquipment = () => {
    setLoading(true);
    api
      .getEquipment()
      .then(setEquipment)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) loadEquipment();
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
      dailyRate: parseFloat(form.dailyRate) || 0,
    };
    try {
      if (editingId) {
        await api.updateEquipment(editingId, payload);
      } else {
        await api.createEquipment(payload);
      }
      resetForm();
      loadEquipment();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: Equipment) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      type: item.type,
      brand: item.brand || '',
      size: item.size || '',
      status: item.status,
      dailyRate: String(item.dailyRate),
      notes: item.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ekipmanı silmek istediğinize emin misiniz?')) return;
    setError('');
    try {
      await api.deleteEquipment(id);
      loadEquipment();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const filtered = equipment.filter((e) =>
    `${e.name} ${e.type} ${e.brand || ''} ${e.size || ''} ${e.status}`
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
            Ekipman
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
            {equipment.length} kayıtlı ekipman
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
          {showForm && !editingId ? 'İptal' : 'Yeni Ekipman'}
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
              {editingId ? 'Ekipman Düzenle' : 'Yeni Ekipman'}
            </h2>
            <button onClick={resetForm} className="p-1 rounded-lg" style={{ color: 'var(--text-muted)' }} aria-label="Kapat">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Ad *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Tür *
              </label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                {equipmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {getEquipmentTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Marka
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Beden
              </label>
              <input
                type="text"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="input-field"
                placeholder="Örn: 165cm / 42"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Durum
              </label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                {equipmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getEquipmentStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Günlük Ücret (₺)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.dailyRate}
                onChange={(e) => setForm({ ...form, dailyRate: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
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
        placeholder="Ekipman ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4 max-w-md"
        aria-label="Ekipman ara"
      />

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>
          Yükleniyor...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          {search ? 'Aramanızla eşleşen ekipman bulunamadı' : 'Henüz ekipman kaydı bulunmuyor'}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                    {item.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {getEquipmentTypeLabel(item.type)}
                    {item.brand ? ` · ${item.brand}` : ''}
                  </p>
                </div>
                <span className={getEquipmentStatusBadgeClass(item.status)}>
                  {getEquipmentStatusLabel(item.status)}
                </span>
              </div>
              <div className="space-y-1 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                {item.size && <p>Beden: {item.size}</p>}
                <p className="font-medium" style={{ color: 'var(--accent)' }}>
                  {formatCurrency(item.dailyRate)}/gün
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                >
                  <Pencil size={14} />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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
