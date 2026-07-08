import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/employeeService';
import type { DashboardStats } from '../../types/employee.types';
import StatCard from './StatCard';
import styles from './DashboardPage.module.css';

/**
 * DashboardPage: primera página que ve el usuario.
 * Muestra un resumen del estado actual del sistema.
 *
 * Flujo de datos:
 * 1. Componente se monta
 * 2. useEffect dispara la llamada a la API
 * 3. Mientras espera: stats=null → las tarjetas muestran skeleton
 * 4. API responde: setStats(data) → React re-renderiza con datos reales
 * 5. Si hay error: setError(message) → se muestra el mensaje de error
 */
export default function DashboardPage() {

  /**
   * Estado del componente:
   * - stats: los datos del backend. null = aún no cargados.
   * - isLoading: true mientras espera la respuesta de la API.
   * - error: mensaje de error si la llamada falla.
   */
  const [stats,     setStats]     = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  /**
   * useEffect con array de dependencias vacío []:
   * Se ejecuta EXACTAMENTE UNA VEZ, cuando el componente se monta.
   * Es el lugar correcto para llamadas a API que cargan datos iniciales.
   *
   * La función interna es async porque await no puede usarse
   * directamente en el callback de useEffect.
   */
  useEffect(() => {
    fetchStats();
  }, []);  // [] = solo al montar, nunca más

  async function fetchStats() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('No se pudieron cargar las estadísticas. Verifica que el backend esté corriendo.');
      console.error('Error cargando dashboard: ', err);
    } finally {
      // finally siempre se ejecuta, tanto si hubo éxito como si hubo error
      setIsLoading(false);
    }
  }

  /**
   * Porcentaje de empleados activos para la barra de progreso.
   * Si stats es null o total es 0, devuelve 0.
   */
  const activePercentage = stats && stats.totalEmployees > 0
    ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100)
    : 0;

  return (
    <div className={styles.page}>

      {/* ── CABECERA ──────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>
            Resumen general del sistema de gestión de empleados
          </p>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={fetchStats}
          disabled={isLoading}
        >
          <svg className={styles.refreshIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isLoading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {/* ── MENSAJE DE ERROR ──────────────────────────────────── */}
      {error && (
        <div className={styles.errorBox}>
          <svg className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* ── TARJETAS DE ESTADÍSTICAS ──────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Empleados"
          value={isLoading ? null : (stats?.totalEmployees ?? 0)}
          accentColor="#2563EB"
          iconBgColor="#EFF6FF"
          footer="Registrados en el sistema"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        <StatCard
          label="Empleados Activos"
          value={isLoading ? null : (stats?.activeEmployees ?? 0)}
          accentColor="#16A34A"
          iconBgColor="#F0FDF4"
          footer="En plantilla actualmente"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          label="Empleados Inactivos"
          value={isLoading ? null : (stats?.inactiveEmployees ?? 0)}
          accentColor="#D97706"
          iconBgColor="#FFFBEB"
          footer="Dados de baja"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          }
        />

        <StatCard
          label="Departamentos"
          value={isLoading ? null : (stats?.totalDepartments ?? 0)}
          accentColor="#7C3AED"
          iconBgColor="#F5F3FF"
          footer="Áreas de la empresa"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          }
        />
      </div>

      {/* ── SECCIÓN DE DISTRIBUCIÓN ───────────────────────────── */}
      {stats && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Distribución de la plantilla</h2>
            <Link to="/employees" className={styles.sectionLink}>
              Ver todos los empleados →
            </Link>
          </div>
          <div className={styles.sectionBody}>
            {/* Barra de progreso activos vs inactivos */}
            <div className={styles.progressLabel}>
              <span>Empleados activos</span>
              <span>
                {stats.activeEmployees} de {stats.totalEmployees} ({activePercentage}%)
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${activePercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}