const API_BASE = '';

async function fetchJson(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'API request failed');
  }

  return response.json();
}

export async function getUsers() {
  return fetchJson('/api/users');
}

export async function loginUser(credentials) {
  return fetchJson('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export async function createUser(userData) {
  return fetchJson('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

export async function getReservations(userId) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  return fetchJson(`/api/reservations${query}`);
}

export async function getMyReservations(userId) {
  if (!userId) {
    throw new Error('userId is required');
  }
  return fetchJson(`/api/reservations/my?userId=${encodeURIComponent(userId)}`);
}

export async function createReservation(reservationData) {
  return fetchJson('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData)
  });
}

export async function updateReservationStatus(id, status) {
  return fetchJson(`/api/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}

export async function deleteReservation(id) {
  return fetchJson(`/api/reservations/${id}`, {
    method: 'DELETE'
  });
}

export async function getAdminReservations() {
  return fetchJson('/api/admin/reservations');
}

export async function getAdminStats() {
  return fetchJson('/api/admin/stats');
}
