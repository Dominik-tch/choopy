export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('jwt_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const API_BASE_URL = import.meta.env.DEV ? 'http://192.168.0.220:8080' : '';
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
            window.dispatchEvent(new Event('auth-expired'));
        }

    return response;
}

export async function extractErrorMessage(response, defaultMessage) {
        try {
            const errData = await response.json();
            return errData.message || defaultMessage;
        } catch (e) {
            return defaultMessage;
        }
    }