import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';import Spinner from '../../../components/ui/Spinner/Spinner';
import styles from './../OverviewPage.module.css';
import { type DepartmentHeadcount, getEmployeesByDepartment } from '../../../services/analytics/analyticsService';

export default function EmployeesAnalyticsPage() {
  const [data, setData] = useState<DepartmentHeadcount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEmployeesByDepartment()
      .then(setData)
      .catch(() => setError('No se pudieron cargar los datos de empleados.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Spinner message="Cargando análisis de empleados..." />;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Análisis de empleados</h1>
        <p className={styles.pageSubtitle}>Distribución de la plantilla por departamento</p>
      </div>

      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>Empleados por departamento</h2>
        </div>
        <div className={styles.chartBody}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(value) => [`${value ?? 0} empleados`, 'Total']} />
              <Bar dataKey="employeeCount" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}