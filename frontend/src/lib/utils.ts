import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

export function getRentalStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    reserved: 'Rezerve',
    active: 'Aktif',
    overdue: 'Gecikmiş',
    returned: 'İade Edildi',
    cancelled: 'İptal',
  };
  return labels[status] || status;
}

export function getRentalStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    reserved: 'badge-info',
    active: 'badge-success',
    overdue: 'badge-danger',
    returned: 'badge-gold',
    cancelled: 'badge-danger',
  };
  return map[status] || 'badge-info';
}

export function getEquipmentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    ski: 'Kayak',
    snowboard: 'Snowboard',
    boots: 'Bot',
    helmet: 'Kask',
    poles: 'Sopalar',
    bindings: 'Bağlama',
  };
  return labels[type] || type;
}

export function getEquipmentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: 'Müsait',
    rented: 'Kirada',
    maintenance: 'Bakımda',
    retired: 'Emekli',
  };
  return labels[status] || status;
}

export function getEquipmentStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    available: 'badge-success',
    rented: 'badge-gold',
    maintenance: 'badge-warning',
    retired: 'badge-danger',
  };
  return map[status] || 'badge-info';
}

export function getTuneJobTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    wax: 'Mum',
    edge_tune: 'Kenar Bileme',
    binding_mount: 'Bağlama Montajı',
    full_tune: 'Tam Bakım',
    repair: 'Onarım',
  };
  return labels[type] || type;
}

export function getTuneJobStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    scheduled: 'Planlandı',
    in_progress: 'Devam Ediyor',
    completed: 'Tamamlandı',
    cancelled: 'İptal',
  };
  return labels[status] || status;
}

export function getTuneJobStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    scheduled: 'badge-info',
    in_progress: 'badge-warning',
    completed: 'badge-success',
    cancelled: 'badge-danger',
  };
  return map[status] || 'badge-info';
}

export function getPackageDurationLabel(duration: string): string {
  const labels: Record<string, string> = {
    half_day: 'Yarım Gün',
    full_day: 'Tam Gün',
    two_day: '2 Gün',
    week: 'Haftalık',
    season: 'Sezonluk',
  };
  return labels[duration] || duration;
}

export function getSkillLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    beginner: 'Başlangıç',
    intermediate: 'Orta',
    advanced: 'İleri',
    expert: 'Uzman',
  };
  return labels[level] || level;
}
