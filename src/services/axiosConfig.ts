import axios from 'axios';

/**
 * Instancia configurada de Axios.
 * En lugar de usar axios directamente en cada servicio,
 * creamos una instancia con configuración base.
 *
 * Ventajas:
 * - URL base configurada una sola vez
 * - Headers comunes (Content-Type) aplicados automáticamente
 * - Interceptores para manejo global de errores
 * - Fácil de cambiar la URL base por entorno (dev/prod)
 *
 * 🔄 Comparación Spring Boot:
 * Es como un RestTemplate o WebClient configurado como @Bean.
 * Lo inyectas donde lo necesitas, no lo creas cada vez.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos: si el servidor no responde, falla con error
});

/**
 * Interceptor de REQUEST.
 * Se ejecuta antes de cada petición saliente.
 *
 * Uso típico: agregar el token JWT al header Authorization.
 * Por ahora solo logueamos en desarrollo.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Cuando se agregue autenticación:
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    if (import.meta.env.DEV) {
      console.log(`→ ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de RESPONSE.
 * Se ejecuta después de cada respuesta recibida.
 *
 * Casos de error comunes:
 * - 401: token expirado → redirigir al login
 * - 403: sin permisos → mostrar mensaje
 * - 500: error del servidor → mostrar mensaje genérico
 */
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`← ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // El servidor respondió con un código de error (4xx, 5xx)
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token expirado o no autenticado
        // window.location.href = '/login';
        console.warn('No autenticado - redirigir al login');
      }

      if (status >= 500) {
        console.error('Error del servidor:', error.response.data);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta (servidor caído, timeout)
      console.error('Sin respuesta del servidor. Verifica que el backend esté corriendo.');
    }

    // Siempre rechaza la promesa para que el catch del servicio lo maneje
    return Promise.reject(error);
  }
);

export default apiClient;