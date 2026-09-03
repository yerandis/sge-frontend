import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner/Spinner';
import styles from './LoginPage.module.css';
import PasswordStrengthBar from '../../components/ui/PasswordStrengthBar/PasswordStrengthBar';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Ingresa tu usuario y contraseña');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login({ username, password });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(msg || 'Credenciales inválidas. Verifica tu usuario y contraseña.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.shell}>
      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logoWrapper}>
          <div className={styles.logoIcon}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className={styles.logoTitle}>SGE</div>
          <div className={styles.logoSub}>Sistema de Gestión de Empleados</div>
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorBanner} style={{ marginBottom: '1rem' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {/* Formulario */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Usuario</label>
            <input
              type="text"
              className={styles.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <PasswordStrengthBar password={password} />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? <><Spinner size="sm" /> Iniciando sesión...</> : 'Iniciar sesión'}
          </button>
        </form>

        {/* Hint de demo */}
        <div className={styles.demoHint}>
          <strong>Credenciales de prueba</strong><br />
          Usuario: <strong>admin</strong> · Contraseña: <strong>admin123</strong>
        </div>

      </div>
    </div>
  );
}