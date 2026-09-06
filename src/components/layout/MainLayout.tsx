import { NavLink, Outlet, useLocation } from 'react-router-dom';
import styles from './MainLayout.module.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../notifications/NotificationBell';
import { useTheme } from '../../hooks/useTheme';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import Breadcrumb from '../ui/Breadcrumb/Breadcrumb';


/**
 * Iconos inline como SVG.
 * En un proyecto real usarías una librería como lucide-react o heroicons.
 * Aquí los incluimos inline para no agregar dependencias.
 */
const Icons = {
  dashboard: (
    <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  employees: (
    <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
   departments: (
    <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  roles: (
    <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  add: (
    <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
};

/**
 * Definición de los items del menú lateral.
 * dashboard, employees, new wmployees
 * Agregar un nuevo item de navegación = agregar un objeto a este array.
 * No hace falta tocar el JSX del componente.
 */
const NAV_ITEMS = [
  { to: '/dashboard',     label: 'Dashboard',       icon: Icons.dashboard },
  { to: '/employees',     label: 'Empleados',       icon: Icons.employees },
  // { to: '/employees/new', label: 'Nuevo Empleado',  icon: Icons.add },
  { to: '/departments',   label: 'Departamentos',   icon: Icons.departments },
  { to: '/roles',         label: 'Roles',           icon: Icons.roles,    permission: 'ROLE_READ' },
];

/**
 * MainLayout: el esqueleto visual de toda la aplicación.
 *
 * Renderiza el sidebar y el header que son COMUNES a todas las páginas.
 * El contenido específico de cada página se renderiza en <Outlet />.
 *
 * <Outlet /> es el componente de React Router que actúa como "hueco".
 * Cuando la URL es /dashboard, React Router renderiza <Dashboard /> dentro de <Outlet />.
 * Cuando la URL es /employees, renderiza <Employees />.
 * El sidebar y el header nunca se desmontan ni se re-renderizan.
 */
export default function MainLayout() {
  const location = useLocation();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { toggleTheme, isDark } = useTheme();
  const breadcrumbItems = useBreadcrumb(); // sin nombre de entidad (para el layout general)


  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  /**
   * Deriva el título de la página activa desde la URL.
   * No es necesario mantener un estado para esto.
   */
  function getPageTitle(): string {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/employees/new') return 'Nuevo Empleado';
    if (path.includes('/employees/') && path.includes('/edit')) return 'Editar Empleado';
    if (path.startsWith('/employees/')) return 'Detalle de Empleado';
    if (path === '/employees') return 'Empleados';
    return 'SGE';
  }

  return (
    <div className={styles.shell}>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside className={styles.sidebar}>

        {/* Marca / Logo */}
        <div className={styles.sidebarBrand}>
          <div className={styles.brandName}>SGE</div>
          <div className={styles.brandSub}>Gestión de Empleados</div>
        </div>

        {/* Navegación */}
        <nav className={styles.sidebarNav}>
          <span className={styles.navSection}>Menú principal</span>

          {NAV_ITEMS.map((item) => (
            /**
             * NavLink de React Router:
             * - Detecta automáticamente si la ruta coincide con la URL actual
             * - Si coincide, aplica la clase 'active' (o la que definamos)
             *
             * className como función: recibe { isActive } y devuelve la clase CSS.
             * Esto es lo que permite el highlight del item activo en el sidebar.
             *
             * end: solo marca como activo si la ruta coincide EXACTAMENTE.
             * Sin 'end', /employees/new también marcaría /employees como activo.
             */
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div className={styles.sidebarFooter}>
        <div style={{ marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.8125rem' }}>
          {user?.username} · {user?.roles}
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.15)',
            color: '#94a3b8', borderRadius: '0.375rem', padding: '0.375rem 0.75rem',
            fontSize: '0.75rem', cursor: 'pointer', width: '100%',
            transition: 'all 0.15s',
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Cerrar sesión
        </button>
        </div>
      </aside>

      {/* ── ÁREA PRINCIPAL ──────────────────────────────────── */}
      <div className={styles.main}>

        {/* Header */}
        <header className={styles.header}>
          {/* <span className={styles.headerTitle}>{getPageTitle()}</span> */}
          {/* {breadcrumbItems.length > 1 && (
            <div style={{ padding: '0.5rem 1.75rem 0', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)' }}>
              <Breadcrumb items={breadcrumbItems} />
            </div>
          )} */}
          
          <div className={styles.headerRight}>
            <span className={styles.headerBadge}>Admin</span>
            <NotificationBell />
           <button
              onClick={toggleTheme}
              className={styles.themeBtn}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? (
                // Icono Sol (modo claro)
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    style={{ width: '1.125rem', height: '1.125rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                // Icono Luna (modo oscuro)
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    style={{ width: '1.125rem', height: '1.125rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Contenido de la página activa */}
        <main className={styles.content}>
          {/*
            <Outlet /> es donde React Router inyecta el componente de la ruta activa.
            Es el equivalente de <%= yield %> en Rails o {#block content} en Thymeleaf.
          */}
          <Outlet />
        </main>
      </div>

    </div>
  );
}