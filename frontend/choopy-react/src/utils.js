export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('jwt_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`http://192.168.0.200:8080${endpoint}`, {
        ...options,
        headers,
    });

    return response;
}