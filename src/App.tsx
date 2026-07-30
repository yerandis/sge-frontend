// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import MainLayout from './components/layout/MainLayout';

// /**
//  * Importaciones lazy: los componentes se cargan solo cuando el usuario
//  * navega a esa ruta. Mejora el tiempo de carga inicial.
//  *
//  * React.lazy + Suspense = code splitting automático con Vite.
//  *
//  * Por ahora las importamos de forma normal para simplificar.
//  * Cuando existan las páginas reales, las cambiaremos por lazy imports.
//  */
// import DashboardPage from './pages/Dashboard/DashboardPage';
// import EmployeesPage from './pages/Employees/EmployeesPage';
// import EmployeeNewPage from './pages/EmployeeNew/EmployeeNewPage';
// import EmployeeEditPage from './pages/EmployeeEdit/EmployeeEditPage';
// import EmployeeDetailPage from './pages/EmployeeDetail/EmployeeDetailPage';

// /**
//  * App.tsx: define la estructura de rutas de toda la aplicación.
//  *
//  * BrowserRouter: usa la History API del navegador.
//  * La URL cambia sin recargar la página (eso es una SPA).
//  *
//  * Estructura de rutas anidadas:
//  * / → redirige a /dashboard
//  * /dashboard → DashboardPage (dentro del MainLayout)
//  * /employees → EmployeesPage (dentro del MainLayout)
//  * /employees/new → EmployeeNewPage (dentro del MainLayout)
//  * /employees/:id → EmployeeDetailPage (dentro del MainLayout)
//  * /employees/:id/edit → EmployeeEditPage (dentro del MainLayout)
//  *
//  * Route path="/" con element={<MainLayout />} hace que el layout
//  * sea compartido por todas las rutas hijas. Sin esta anidación,
//  * tendríamos que renderizar el sidebar en cada página.
//  */
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Ruta raíz: redirige a /dashboard */}
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />

//         {/* Rutas que comparten el MainLayout */}
//         <Route element={<MainLayout />}>
//           <Route path="/dashboard" element={<DashboardPage />} />
//           <Route path="/employees" element={<EmployeesPage />} />
//           <Route path="/employees/new" element={<EmployeeNewPage />} />
//           <Route path="/employees/:id" element={<EmployeeDetailPage />} />
//           <Route path="/employees/:id/edit" element={<EmployeeEditPage />} />
//         </Route>

//         {/* Ruta catch-all: redirige a /dashboard si la URL no existe */}
//         <Route path="*" element={<Navigate to="/dashboard" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from './assets/vite.svg'
// // import heroImg from './assets/hero.png'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <section id="center">
// //         <div className="hero">
// //           <img src={heroImg} className="base" width="170" height="179" alt="" />
// //           <img src={reactLogo} className="framework" alt="React logo" />
// //           <img src={viteLogo} className="vite" alt="Vite logo" />
// //         </div>
// //         <div>
// //           <h1>Get started</h1>
// //           <p>
// //             Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
// //           </p>
// //         </div>
// //         <button
// //           type="button"
// //           className="counter"
// //           onClick={() => setCount((count) => count + 1)}
// //         >
// //           Count is {count}
// //         </button>
// //       </section>

// //       <div className="ticks"></div>

// //       <section id="next-steps">
// //         <div id="docs">
// //           <svg className="icon" role="presentation" aria-hidden="true">
// //             <use href="/icons.svg#documentation-icon"></use>
// //           </svg>
// //           <h2>Documentation</h2>
// //           <p>Your questions, answered</p>
// //           <ul>
// //             <li>
// //               <a href="https://vite.dev/" target="_blank">
// //                 <img className="logo" src={viteLogo} alt="" />
// //                 Explore Vite
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://react.dev/" target="_blank">
// //                 <img className="button-icon" src={reactLogo} alt="" />
// //                 Learn more
// //               </a>
// //             </li>
// //           </ul>
// //         </div>
// //         <div id="social">
// //           <svg className="icon" role="presentation" aria-hidden="true">
// //             <use href="/icons.svg#social-icon"></use>
// //           </svg>
// //           <h2>Connect with us</h2>
// //           <p>Join the Vite community</p>
// //           <ul>
// //             <li>
// //               <a href="https://github.com/vitejs/vite" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#github-icon"></use>
// //                 </svg>
// //                 GitHub
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://chat.vite.dev/" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#discord-icon"></use>
// //                 </svg>
// //                 Discord
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://x.com/vite_js" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#x-icon"></use>
// //                 </svg>
// //                 X.com
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://bsky.app/profile/vite.dev" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#bluesky-icon"></use>
// //                 </svg>
// //                 Bluesky
// //               </a>
// //             </li>
// //           </ul>
// //         </div>
// //       </section>

// //       <div className="ticks"></div>
// //       <section id="spacer"></section>
// //     </>
// //   )
// // }

// // export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import EmployeesPage from './pages/Employee/Employees/EmployeesPage';
import EmployeeNewPage from './pages/Employee/EmployeeNew/EmployeeNewPage';
import EmployeeEditPage from './pages/Employee/EmployeeEdit/EmployeeEditPage';
import EmployeeDetailPage from './pages/Employee/EmployeeDetail/EmployeeDetailPage';
import DepartmentPage from './pages/Department/Departments/DepartmentsPage';
import DepartmentDetailPage from './pages/Department/DepartmentDetail/DepartmentDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Employees */}
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/new" element={<EmployeeNewPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailPage />} />
            <Route path="/employees/:id/edit" element={<EmployeeEditPage />} />
            {/* Departments */}
            <Route path="/departments" element={<DepartmentPage/>} />
            <Route path="/departments/:id" element={<DepartmentDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}