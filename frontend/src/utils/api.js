import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Crucial for reading/writing HttpOnly session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');

      const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
      const currentPath = window.location.pathname;
      const isPublicPath = publicPaths.some((path) => currentPath.startsWith(path)) || currentPath === '/';

      if (!isPublicPath) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
