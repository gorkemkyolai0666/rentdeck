'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AlpineNavLayout } from '@/components/alpine-nav-layout';
import {
  formatCurrency,
  formatDate,
  getRentalStatusLabel,
  getRentalStatusBadgeClass,
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

interface RentalPackage {
  id: string;
  name: string;
}

interface Rental {
  id: string;
  startDate: string;
  endDate?: string;
  status: string;
  totalPrice: number;
  depositPaid: number;
  notes?: string;
  renter?: Renter;
  equipment?: Equipment;
  package?: RentalPackage;
}

const rentalStatuses = ['reserved', 'active', 'overdue', 'returned', 'cancelled'];

const emptyForm = {
  renterId: '',
  equipmentId: '',
  packageId: '',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  status: 'active',
  totalPrice: '',
  depositPaid: '',
  notes: '',
};

export default function RentalsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [renters, setRenters] = useState<Renter[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [packages, setPackages] = useState<RentalPackage[]>([]);
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
    Promise.all([api.getRentals(), api.getRenters(), api.getEquipment(), api.getRentalPackages()])
      .then(([rentalsData, rentersData, equipmentData, packagesData]) => {
        setRentals(rentalsData);
        setRenters(rentersData);
        setEquipment(equipmentData);
        setPackages(packagesData);
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
      startDate: form.startDate,
      status: form.status,
      totalPrice: parseFloat(form.totalPrice) || 0,
      depositPaid: parseFloat(form.depositPaid) || 0,
      notes: form.notes,
    };
    if (form.equipmentId) payload.equipmentId = form.equipmentId;
    if (form.packageId) payload.packageId = form.packageId;
    if (form.endDate) payload.endDate = form.endDate;

    try {
      await api.createRental(payload);
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
      await api.updateRental(id, { status });
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Durum güncellenemedi');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = rentals.filter((r) =>
    `${r.renter?.fullName || ''} ${r.equipment?.name || ''} ${r.package?.name || ''} ${r.status}`
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
            Kiralamalar
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
            {rentals.length} kayıtlı kiralama
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary shrink-0 flex items-center gap-2">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'İptal' : 'Yeni Kiralama'}
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
            Yeni Kiralama
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
                Paket
              </label>
              <select
                value={form.packageId}
                onChange={(e) => setForm({ ...form, packageId: e.target.value })}
                className="input-field"
              >
                <option value="">Seçin...</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
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
                {rentalStatuses.map((s) => (
                  <option key={s} value={s}>
                    {getRentalStatusLabel(s)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Başlangıç Tarihi *
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Toplam Fiyat (₺)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.totalPrice}
                onChange={(e) => setForm({ ...form, totalPrice: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Alınan Depozito (₺)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.depositPaid}
                onChange={(e) => setForm({ ...form, depositPaid: e.target.value })}
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
            <div className="md:col-span-2">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                <Check size={16} />
                {saving ? 'Oluşturuluyor...' : 'Kiralama Oluştur'}
              </button>
            </div>
          </form>
        </div>
      )}

      <input
        type="search"
        placeholder="Kiralama ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4 max-w-md"
        aria-label="Kiralama ara"
      />

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>
          Yükleniyor...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          {search ? 'Aramanızla eşleşen kiralama bulunamadı' : 'Henüz kiralama kaydı bulunmuyor'}
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <th className="text-left p-4 font-medium" style={{ color: 'var(--text-muted)' }}>
                    Kiracı
                  </th>
                  <th className="text-left p-4 font-medium hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>
                    Ekipman / Paket
                  </th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>
                    Tarih
                  </th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>
                    Tutar
                  </th>
                  <th className="text-left p-4 font-medium" style={{ color: 'var(--text-muted)' }}>
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rental) => (
                  <tr key={rental.id} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                    <td className="p-4">
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {rental.renter?.fullName || '—'}
                      </div>
                      <div className="text-xs lg:hidden mt-1" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(rental.startDate)}
                        {rental.endDate ? ` – ${formatDate(rental.endDate)}` : ''}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>
                      {rental.equipment?.name || rental.package?.name || '—'}
                    </td>
                    <td className="p-4 hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>
                      {formatDate(rental.startDate)}
                      {rental.endDate ? ` – ${formatDate(rental.endDate)}` : ''}
                    </td>
                    <td className="p-4 hidden lg:table-cell font-medium" style={{ color: 'var(--accent)' }}>
                      {formatCurrency(rental.totalPrice)}
                    </td>
                    <td className="p-4">
                      <select
                        value={rental.status}
                        onChange={(e) => handleStatusUpdate(rental.id, e.target.value)}
                        disabled={updatingId === rental.id}
                        className={`input-field py-1.5 text-xs max-w-[140px] ${getRentalStatusBadgeClass(rental.status)}`}
                        aria-label="Kiralama durumu"
                      >
                        {rentalStatuses.map((s) => (
                          <option key={s} value={s}>
                            {getRentalStatusLabel(s)}
                          </option>
                        ))}
                      </select>
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
