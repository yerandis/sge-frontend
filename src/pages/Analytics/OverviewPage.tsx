import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, type PieLabelRenderProps
} from 'recharts';
import apiClient from '../../services/axiosConfig';
import Spinner from '../../components/ui/Spinner/Spinner';
import styles from './OverviewPage.module.css';

interface DeptData  { name: string; count: number; }
interface TrendData { month: string; hired: number; }
interface StatusData { name: string; value: number; color: string; }
interface DepartmentResponse {name: string;  count: number;}

export default function OverviewPage() {

  const [deptData,   setDeptData]   = useState<DeptData[]>([]);
  const [trendData,  setTrendData]  = useState<TrendData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, deptRes] = await Promise.all([
          apiClient.get('/employees/dashboard/stats'),
          apiClient.get('/analytics/employees-by-department'),
        ]);

        const stats = statsRes.data.data;
        setStatusData([
          { name: 'Activos',   value: stats.activeEmployees,   color: '#16a34a' },
          { name: 'Inactivos', value: stats.inactiveEmployees, color: '#94a3b8' },
        ]);

        const departments = deptRes.data.data as DepartmentResponse[];

        setDeptData(
          departments.map((d) => ({
            name: d.name,
            count: d.count,
          }))
        );

        // Datos de tendencia simulados mientras se implementa el endpoint real
        setTrendData([
          { month: 'Ene', hired: 2 }, { month: 'Feb', hired: 1 },
          { month: 'Mar', hired: 3 }, { month: 'Abr', hired: 2 },
          { month: 'May', hired: 4 }, { month: 'Jun', hired: 1 },
          { month: 'Jul', hired: 3 }, { month: 'Ago', hired: 2 },
          { month: 'Sep', hired: 5 }, { month: 'Oct', hired: 2 },
          { month: 'Nov', hired: 1 }, { month: 'Dic', hired: 3 },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) return <Spinner message="Cargando analítica..." />;

  // const total = statusData.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Resumen de Analítica</h1>
        <p className={styles.pageSubtitle}>Visión general de los datos de la organización</p>
      </div>

      <div className={styles.chartsGrid}>

        {/* Gráfico 1: Empleados por departamento */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Empleados por Departamento</h2>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={deptData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [`${value ?? 0} empleados`, 'Total']}
                  cursor={{ fill: 'rgba(124,58,237,0.08)' }}
                />
                <Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Distribución activos/inactivos */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Distribución de Plantilla</h2>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: PieLabelRenderProps) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              <Tooltip
                formatter={(value) => [`${value ?? 0} empleados`]}
              />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 3: Tendencia de contratación */}
        <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Tendencia de Contratación (12 meses)</h2>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(value) => [`${value ?? 0} contrataciones`]} />
                <Line
                  type="monotone" dataKey="hired"
                  stroke="#7c3aed" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#7c3aed' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}