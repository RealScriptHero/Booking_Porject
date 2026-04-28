const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const API_BASE_CANDIDATES = API_BASE
  ? [API_BASE, '']
  : ['', 'http://localhost:5000'];

async function fetchJson(url, options = {}) {
  let lastError = null;

  for (const base of API_BASE_CANDIDATES) {
    try {
      const response = await fetch(`${base}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });

      if (!response.ok) {
        let message = 'API request failed';
        const rawBody = await response.text();
        if (rawBody) {
          try {
            const errorData = JSON.parse(rawBody);
            message = errorData?.error || rawBody;
          } catch (_) {
            message = rawBody;
          }
        }
        throw new Error(message);
      }

      return response.json();
    } catch (error) {
      // Retry only for network-level failures. For API errors (4xx/5xx), fail immediately.
      if (error instanceof TypeError) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  if (lastError) {
    throw new Error('Cannot reach backend API. Make sure backend is running on port 5000.');
  }

  throw new Error('API request failed');
}

export async function getUsers() {
  return fetchJson('/api/users');
}

export async function loginUser(credentials) {
  return fetchJson('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export async function createUser(userData) {
  return fetchJson('/api/register', {
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
  return fetchJson('/api/admin/analytics');
}

export async function getAdminAnalytics() {
  return fetchJson('/api/admin/analytics');
}

export async function getAdminCustomers() {
  return fetchJson('/api/admin/customers');
}

export async function getCustomerReservations(customerId) {
  return fetchJson(`/api/admin/customers/${customerId}/reservations`);
}

export async function deleteCustomer(customerId) {
  return fetchJson(`/api/admin/customers/${customerId}`, {
    method: 'DELETE'
  });
}
