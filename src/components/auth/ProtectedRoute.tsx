// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import Spinner from '../ui/Spinner/Spinner';

// /**
//  * ProtectedRoute: wrapper que verifica autenticación.
//  * Si no está autenticado → redirige al login.
//  * Si está cargando → muestra spinner.
//  * Si está autenticado → renderiza la ruta hija con <Outlet />.
//  */
// export default function ProtectedRoute() {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <Spinner message="Verificando sesión..." />
//       </div>
//     );
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// }