'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AlpineNavLayout } from '@/components/alpine-nav-layout';
import {
  formatDateTime,
  getTuneJobTypeLabel,
  getTuneJobStatusLabel,
  getTuneJobStatusBadgeClass,
} from '@/lib/utils';
import { Plus, X, Check } from 'lucide-react';

interface Renter {
  id: string;
  fullName: string;
}

interface Equipment {
  id: string;
  name: string;
}

interface TuneJob {
  id: string;
  scheduledAt: string;
  type: string;
  status: string;
  technician?: string;
  notes?: string;
  renter?: Renter;
  equipment?: Equipment;
}

const tuneJobTypes = ['wax', 'edge_tune', 'binding_mount', 'full_tune', 'repair'];
const tuneJobStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];

const emptyForm = {
  renterId: '',
  equipmentId: '',
  scheduledAt: new Date().toISOString().slice(0, 16),
  type: 'wax',
  status: 'scheduled',
  technician: '',
  notes: '',
};

export default function TuneJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<TuneJob[]>([]);
  const [renters, setRenters] = useState<Renter[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getTuneJobs(), api.getRenters(), api.getEquipment()])
      .then(([jobsData, rentersData, equipmentData]) => {
        setJobs(jobsData);
        setRenters(rentersData);
        setEquipment(equipmentData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload: Record<string, unknown> = {
      renterId: form.renterId,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      type: form.type,
      status: form.status,
      technician: form.technician,
      notes: form.notes,
    };
    if (form.equipmentId) payload.equipmentId = form.equipmentId;

    try {
      await api.createTuneJob(payload);
      setShowForm(false);
      setForm(emptyForm);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    setError('');
    try {
      await api.updateTuneJob(id, { status });
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Durum güncellenemedi');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = jobs.filter((j) =>
    `${j.renter?.fullName || ''} ${j.equipment?.name || ''} ${j.type} ${j.status} ${j.technician || ''}`
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
            Bakım İşleri
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
            {jobs.length} kayıtlı bakım işi
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary shrink-0 flex items-center gap-2">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'İptal' : 'Yeni Bakım'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl mb-4 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Yeni Bakım İşi
          </h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Kiracı *
              </label>
              <select
                value={form.renterId}
                onChange={(e) => setForm({ ...form, renterId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Seçin...</option>
                {renters.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Ekipman
              </label>
              <select
                value={form.equipmentId}
                onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}
                className="input-field"
              >
                <option value="">Seçin...</option>
                {equipment.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                İş Türü *
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field"
              >
                {tuneJobTypes.map((t) => (
                  <option key={t} value={t}>
                    {getTuneJobTypeLabel(t)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Planlanan Tarih *
              </label>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Teknisyen
              </label>
              <input
                type="text"
                value={form.technician}
                onChange={(e) => setForm({ ...form, technician: e.target.value })}
                className="input-field"
                placeholder="Teknisyen adı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Durum
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-field"
              >
                {tuneJobStatuses.map((s) => (
                  <option key={s} value={s}>
                    {getTuneJobStatusLabel(s)}
                  </option>
                ))}
              </select>
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
            <div className="md:col-span-2">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                <Check size={16} />
                {saving ? 'Oluşturuluyor...' : 'Bakım İşi Oluştur'}
              </button>
            </div>
          </form>
        </div>
      )}

      <input
        type="search"
        placeholder="Bakım işi ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4 max-w-md"
        aria-label="Bakım işi ara"
      />

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>
          Yükleniyor...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          {search ? 'Aramanızla eşleşen bakım işi bulunamadı' : 'Henüz bakım işi kaydı bulunmuyor'}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <div key={job.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={getTuneJobStatusBadgeClass(job.status)}>
                      {getTuneJobStatusLabel(job.status)}
                    </span>
                    <span className="badge-gold">{getTuneJobTypeLabel(job.type)}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    {job.renter?.fullName || '—'}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {formatDateTime(job.scheduledAt)}
                    {job.equipment ? ` · ${job.equipment.name}` : ''}
                    {job.technician ? ` · ${job.technician}` : ''}
                  </p>
                  {job.notes && (
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      {job.notes}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Durum Güncelle
                  </label>
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusUpdate(job.id, e.target.value)}
                    disabled={updatingId === job.id}
                    className="input-field py-2 text-sm min-w-[160px]"
                    aria-label="Bakım durumu"
                  >
                    {tuneJobStatuses.map((s) => (
                      <option key={s} value={s}>
                        {getTuneJobStatusLabel(s)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AlpineNavLayout>
  );
}
