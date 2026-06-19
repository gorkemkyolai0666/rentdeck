const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4541/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('rentdeck_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('rentdeck_token');
    localStorage.removeItem('rentdeck_user');
    window.location.href = '/login';
    throw new Error('Oturum süresi doldu');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  health: () => fetchAPI('/health'),

  login: (email: string, password: string) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data: { email: string; password: string; firstName: string; lastName: string; shopName: string; city?: string; region?: string }) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  me: () => fetchAPI('/auth/me'),

  dashboardStats: () => fetchAPI('/dashboard/stats'),

  getRenters: () => fetchAPI('/renters'),
  getRenter: (id: string) => fetchAPI(`/renters/${id}`),
  createRenter: (data: Record<string, unknown>) => fetchAPI('/renters', { method: 'POST', body: JSON.stringify(data) }),
  updateRenter: (id: string, data: Record<string, unknown>) => fetchAPI(`/renters/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteRenter: (id: string) => fetchAPI(`/renters/${id}`, { method: 'DELETE' }),

  getEquipment: () => fetchAPI('/equipment'),
  createEquipment: (data: Record<string, unknown>) => fetchAPI('/equipment', { method: 'POST', body: JSON.stringify(data) }),
  updateEquipment: (id: string, data: Record<string, unknown>) => fetchAPI(`/equipment/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteEquipment: (id: string) => fetchAPI(`/equipment/${id}`, { method: 'DELETE' }),

  getRentalPackages: () => fetchAPI('/rental-packages'),
  createRentalPackage: (data: Record<string, unknown>) => fetchAPI('/rental-packages', { method: 'POST', body: JSON.stringify(data) }),
  updateRentalPackage: (id: string, data: Record<string, unknown>) => fetchAPI(`/rental-packages/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteRentalPackage: (id: string) => fetchAPI(`/rental-packages/${id}`, { method: 'DELETE' }),

  getRentals: () => fetchAPI('/rentals'),
  createRental: (data: Record<string, unknown>) => fetchAPI('/rentals', { method: 'POST', body: JSON.stringify(data) }),
  updateRental: (id: string, data: Record<string, unknown>) => fetchAPI(`/rentals/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteRental: (id: string) => fetchAPI(`/rentals/${id}`, { method: 'DELETE' }),

  getTuneJobs: () => fetchAPI('/tune-jobs'),
  createTuneJob: (data: Record<string, unknown>) => fetchAPI('/tune-jobs', { method: 'POST', body: JSON.stringify(data) }),
  updateTuneJob: (id: string, data: Record<string, unknown>) => fetchAPI(`/tune-jobs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTuneJob: (id: string) => fetchAPI(`/tune-jobs/${id}`, { method: 'DELETE' }),

  getShop: () => fetchAPI('/shop'),
  updateShop: (data: Record<string, unknown>) => fetchAPI('/shop', { method: 'PATCH', body: JSON.stringify(data) }),
};
