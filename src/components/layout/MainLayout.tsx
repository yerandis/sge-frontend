// import { NavLink, Outlet, useLocation } from 'react-router-dom';
// import styles from './MainLayout.module.css';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import NotificationBell from '../notifications/NotificationBell';
// import { useTheme } from '../../hooks/useTheme';
// // import { useBreadcrumb } from '../../hooks/useBreadcrumb';
// // import Breadcrumb from '../ui/Breadcrumb/Breadcrumb';


// /**
//  * Iconos inline como SVG.
//  * En un proyecto real usarías una librería como lucide-react o heroicons.
//  * Aquí los incluimos inline para no agregar dependencias.
//  */
// const Icons = {
//   dashboard: (
//     <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round"
//         d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//     </svg>
//   ),
//   employees: (
//     <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round"
//         d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
//   ),
//    departments: (
//     <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round"
//         d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
//   ),
//   roles: (
//     <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round"
//         d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
//   ),
//   users: (
//     <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round"
//         d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
//   ),
//   add: (
//     <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//     </svg>
//   ),
// };

// /**
//  * Definición de los items del menú lateral.
//  * dashboard, employees, new wmployees
//  * Agregar un nuevo item de navegación = agregar un objeto a este array.
//  * No hace falta tocar el JSX del componente.
//  */
// const NAV_ITEMS = [
//   { to: '/dashboard',     label: 'Dashboard',       icon: Icons.dashboard },
//   { to: '/employees',     label: 'Empleados',       icon: Icons.employees },
//   // { to: '/employees/new', label: 'Nuevo Empleado',  icon: Icons.add },
//   { to: '/departments',   label: 'Departamentos',   icon: Icons.departments },
//   { to: '/roles',         label: 'Roles',           icon: Icons.roles,    permission: 'ROLE_READ' },
//   { to: '/users',         label: 'Usuarios',        icon: Icons.users,    permission: 'USER_READ' },
// ];

// /**
//  * MainLayout: el esqueleto visual de toda la aplicación.
//  *
//  * Renderiza el sidebar y el header que son COMUNES a todas las páginas.
//  * El contenido específico de cada página se renderiza en <Outlet />.
//  *
//  * <Outlet /> es el componente de React Router que actúa como "hueco".
//  * Cuando la URL es /dashboard, React Router renderiza <Dashboard /> dentro de <Outlet />.
//  * Cuando la URL es /employees, renderiza <Employees />.
//  * El sidebar y el header nunca se desmontan ni se re-renderizan.
//  */
// export default function MainLayout() {
//   const location = useLocation();

//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const { toggleTheme, isDark } = useTheme();
//   // const breadcrumbItems = useBreadcrumb(); // sin nombre de entidad (para el layout general)


//   async function handleLogout() {
//     await logout();
//     navigate('/login');
//   }

//   /**
//    * Deriva el título de la página activa desde la URL.
//    * No es necesario mantener un estado para esto.
//    */
//   function getPageTitle(): string {
//     const path = location.pathname;
//     if (path === '/dashboard') return 'Dashboard';
//     if (path === '/employees/new') return 'Nuevo Empleado';
//     if (path.includes('/employees/') && path.includes('/edit')) return 'Editar Empleado';
//     if (path.startsWith('/employees/')) return 'Detalle de Empleado';
//     if (path === '/employees') return 'Empleados';
//     return 'SGE';
//   }

//   return (
//     <div className={styles.shell}>

//       {/* ── SIDEBAR ─────────────────────────────────────────── */}
//       <aside className={styles.sidebar}>

//         {/* Marca / Logo */}
//         <div className={styles.sidebarBrand}>
//           <div className={styles.brandName}>SGE</div>
//           <div className={styles.brandSub}>Gestión de Empleados</div>
//         </div>

//         {/* Navegación */}
//         <nav className={styles.sidebarNav}>
//           <span className={styles.navSection}>Menú principal</span>

//           {NAV_ITEMS.map((item) => (
//             /**
//              * NavLink de React Router:
//              * - Detecta automáticamente si la ruta coincide con la URL actual
//              * - Si coincide, aplica la clase 'active' (o la que definamos)
//              *
//              * className como función: recibe { isActive } y devuelve la clase CSS.
//              * Esto es lo que permite el highlight del item activo en el sidebar.
//              *
//              * end: solo marca como activo si la ruta coincide EXACTAMENTE.
//              * Sin 'end', /employees/new también marcaría /employees como activo.
//              */
//             <NavLink
//               key={item.to}
//               to={item.to}
//               end={item.to === '/dashboard'}
//               className={({ isActive }) =>
//                 `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
//               }
//             >
//               {item.icon}
//               {item.label}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Footer del sidebar */}
//         <div className={styles.sidebarFooter}>
//         <div style={{ marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.8125rem' }}>
//           {user?.username} · {user?.roles}
//         </div>
//         <button
//           onClick={handleLogout}
//           style={{
//             background: 'none', border: '1px solid rgba(255,255,255,0.15)',
//             color: '#94a3b8', borderRadius: '0.375rem', padding: '0.375rem 0.75rem',
//             fontSize: '0.75rem', cursor: 'pointer', width: '100%',
//             transition: 'all 0.15s',
//           }}
//           onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)')}
//           onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
//         >
//           Cerrar sesión
//         </button>
//         </div>
//       </aside>

//       {/* ── ÁREA PRINCIPAL ──────────────────────────────────── */}
//       <div className={styles.main}>

//         {/* Header */}
//         <header className={styles.header}>
//           {/* <span className={styles.headerTitle}>{getPageTitle()}</span> */}
//           {/* {breadcrumbItems.length > 1 && (
//             <div style={{ padding: '0.5rem 1.75rem 0', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)' }}>
//               <Breadcrumb items={breadcrumbItems} />
//             </div>
//           )} */}
          
//           <div className={styles.headerRight}>
//             <span className={styles.headerBadge}>Admin</span>
//             <NotificationBell />
//            <button
//               onClick={toggleTheme}
//               className={styles.themeBtn}
//               title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
//             >
//               {isDark ? (
//                 // Icono Sol (modo claro)
//                 <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
//                     style={{ width: '1.125rem', height: '1.125rem' }}>
//                   <path strokeLinecap="round" strokeLinejoin="round"
//                     d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
//                 </svg>
//               ) : (
//                 // Icono Luna (modo oscuro)
//                 <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
//                     style={{ width: '1.125rem', height: '1.125rem' }}>
//                   <path strokeLinecap="round" strokeLinejoin="round"
//                     d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </header>

//         {/* Contenido de la página activa */}
//         <main className={styles.content}>
//           {/*
//             <Outlet /> es donde React Router inyecta el componente de la ruta activa.
//             Es el equivalente de <%= yield %> en Rails o {#block content} en Thymeleaf.
//           */}
//           <Outlet />
//         </main>
//       </div>

//     </div>
//   );
// }

// src/components/layout/MainLayout.tsx

import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, type JSX } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import NotificationBell from '../notifications/NotificationBell';
import styles from './MainLayout.module.css';

// ─── Definición de módulos ─────────────────────────────────────────
interface ModuleNav {
  id:    string;
  label: string;
  color: string;               // color acento del módulo
  defaultPath: string;         // ruta al hacer clic en el módulo
  navItems: NavItemDef[];
}

interface NavItemDef {
  to:          string;
  label:       string;
  icon:        JSX.Element;
  permission?: string;
  end?:        boolean;
}

// Ícono genérico reutilizable
function Icon({ d }: { d: string }) {
  return (
    <svg style={{ width: '1.125rem', height: '1.125rem', flexShrink: 0 }}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const MODULES: ModuleNav[] = [
  {
    id: 'admin',
    label: 'Administración',
    color: '#2563EB',
    defaultPath: '/dashboard',
    navItems: [
      {
        to: '/dashboard', label: 'Dashboard', end: true,
        icon: <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
      },
      {
        to: '/employees', label: 'Empleados', permission: 'EMPLOYEE_READ',
        icon: <Icon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
      },
      {
        to: '/departments', label: 'Departamentos', permission: 'DEPARTMENT_READ',
        icon: <Icon d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />,
      },
      {
        to: '/users', label: 'Usuarios', permission: 'USER_READ',
        icon: <Icon d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
      },
      {
        to: '/roles', label: 'Roles', permission: 'ROLE_READ',
        icon: <Icon d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />,
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analítica',
    color: '#7c3aed',
    defaultPath: '/analytics/overview',
    navItems: [
      {
        to: '/analytics/overview', label: 'Resumen', end: true,
        icon: <Icon d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />,
      },
      {
        to: '/analytics/employees', label: 'Empleados', permission: 'REPORT_VIEW',
        icon: <Icon d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />,
      },
      {
        to: '/analytics/departments', label: 'Departamentos', permission: 'REPORT_VIEW',
        icon: <Icon d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />,
      },
    ],
  },
];

// ─── Detectar módulo activo desde la URL ───────────────────────────
function detectActiveModule(pathname: string): string {
  if (pathname.startsWith('/analytics')) return 'analytics';
  return 'admin';
}

export default function MainLayout() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  const activeModuleId = detectActiveModule(location.pathname);
  const activeModule   = MODULES.find(m => m.id === activeModuleId) ?? MODULES[0];

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className={styles.shell}>

      {/* ── SIDEBAR ───────────────────────────────────────────── */}
      <aside className={styles.sidebar}
        style={{ '--sidebar-accent': activeModule.color } as React.CSSProperties}>

        {/* Marca */}
        <div className={styles.sidebarBrand}>
          <div className={styles.brandName}>SGE</div>
          <div className={styles.brandSub}>{activeModule.label}</div>
        </div>

        {/* Navegación del módulo activo */}
        <nav className={styles.sidebarNav}>
          {activeModule.navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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
          <div className={styles.sidebarUser}>
            <div className={styles.sidebarUserAvatar}>
              {user?.username?.substring(0, 2).toUpperCase() ?? 'US'}
            </div>
            <div className={styles.sidebarUserInfo}>
              <div className={styles.sidebarUserName}>{user?.username}</div>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── ÁREA PRINCIPAL ────────────────────────────────────── */}
      <div className={styles.main}>

        {/* ── HEADER ──────────────────────────────────────────── */}
        <header className={styles.header}>

          {/* Izquierda: selector de módulos */}
          <div className={styles.headerModules}>
            {MODULES.map(mod => (
              <button
                key={mod.id}
                className={`${styles.moduleTab} ${activeModuleId === mod.id ? styles.moduleTabActive : ''}`}
                style={activeModuleId === mod.id
                  ? { '--tab-color': mod.color } as React.CSSProperties
                  : undefined
                }
                onClick={() => navigate(mod.defaultPath)}
              >
                {mod.label}
              </button>
            ))}
          </div>

          {/* Derecha: notificaciones, tema, usuario */}
          <div className={styles.headerRight}>
            <NotificationBell />

            <button
              className={styles.iconBtn}
              onClick={toggleTheme}
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                     style={{ width: '1.125rem', height: '1.125rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                     style={{ width: '1.125rem', height: '1.125rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Badge de usuario */}
            <div className={styles.userBadge}>
              <div className={styles.userAvatar}>
                {user?.username?.substring(0, 2).toUpperCase() ?? 'US'}
              </div>
              <span className={styles.userName}>{user?.username}</span>
            </div>
          </div>
        </header>

        {/* ── CONTENIDO ─────────────────────────────────────── */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

    </div>
  );
}