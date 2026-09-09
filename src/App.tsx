
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
import DepartmentEditPage from './pages/Department/DepartmentEdit/DepartmentEditPage';
import DepartmentNewPage from './pages/Department/DepartmentNew/DepartmentNewPage';
import RolesPage from './pages/Roles/RolesPage';

import NotificationToast from './components/notifications/NotificationToast';
import NotificationPanel from './components/notifications/NotificationPanel';
import UsersPage from './pages/Users/UsersPage';

export default function App() {
  return (
    <BrowserRouter>
        <NotificationToast />
        <NotificationPanel />
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
            <Route path="/departments/new" element={<DepartmentNewPage />} />
            <Route path="/departments/:id/edit" element={<DepartmentEditPage />} />
            {/* Roles */}
            {/* <Route element={<PermissionRoute permission="ROLE_READ" />}> */}
            <Route path="/roles" element={<RolesPage />} />
            {/* User */}
            <Route path="/users" element={<UsersPage />} />
            {/* </Route> */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}