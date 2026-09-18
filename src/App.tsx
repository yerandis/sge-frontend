
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
import UsersPage from './pages/Users/Users/UsersPage';
import OverviewPage from './pages/Analytics/OverviewPage';
import UserNewPage from './pages/Users/UserNew/UserNewPage';
import UserDetailPage from './pages/Users/UserDetail/UserDetailPage';
import UserEditPage from './pages/Users/UserEdit/UserEditPage';
import PermissionRoute from './components/auth/PermissionRoute';
import DepartmentsAnalyticsPage from './pages/Analytics/Department/DepartmentsAnalyticsPage';
import EmployeesAnalyticsPage from './pages/Analytics/Employee/EmployeesAnalyticsPage';


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
          {/* ADMINISTRATION MODULE */}
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* ------  Employees ------ */}
            <Route element={<PermissionRoute permission="EMPLOYEE_READ" />}>
              <Route path="/employees"          element={<EmployeesPage />} />
            </Route>
            <Route element={<PermissionRoute permission="EMPLOYEE_CREATE" />}>
              <Route path="/employees/new"      element={<EmployeeNewPage />} />
            </Route>
            <Route element={<PermissionRoute permission="EMPLOYEE_READ" />}>
              <Route path="/employees/:id"      element={<EmployeeDetailPage />} />
            </Route>
            <Route element={<PermissionRoute permission="EMPLOYEE_UPDATE" />}>
              <Route path="/employees/:id/edit" element={<EmployeeEditPage />} />
            </Route>
            {/* ------  Departments ------ */}
            <Route element={<PermissionRoute permission="DEPARTMENT_READ" />}>
              <Route path="/departments"          element={<DepartmentPage/>} />
            </Route>
            <Route element={<PermissionRoute permission="DEPARTMENT_READ" />}>
              <Route path="/departments/:id"      element={<DepartmentDetailPage />} />
            </Route>
            <Route element={<PermissionRoute permission="DEPARTMENT_CREATE" />}>
              <Route path="/departments/new"      element={<DepartmentNewPage />} />
            </Route>
            <Route element={<PermissionRoute permission="DEPARTMENT_UPDATE" />}>
              <Route path="/departments/:id/edit" element={<DepartmentEditPage />} />
            </Route>
            {/* ------  Roles ------ */}
            <Route element={<PermissionRoute permission="ROLE_READ" />}>
              <Route path="/roles" element={<RolesPage />} />
            </Route>
            {/* ------  User  ------ */}
            <Route element={<PermissionRoute permission="USER_READ" />}>
              <Route path="/users"      element={<UsersPage />} />
            </Route>
            <Route element={<PermissionRoute permission="USER_CREATE" />}>
              <Route path="/users/new"  element={<UserNewPage/>}/>
            </Route>
            <Route element={<PermissionRoute permission="USER_READ" />}>
              <Route path="/users/:id"  element={<UserDetailPage/>} />
            </Route>
            <Route element={<PermissionRoute permission="USER_UPDATE" />}>
              <Route path="/users/:id/edit" element={<UserEditPage/>}/>
            </Route>
            
          {/* ANALITIC MODULE  */}
             <Route path="/analytics/overview" element={<OverviewPage />} />

            <Route element={<PermissionRoute permission="REPORT_VIEW" />}>
              <Route path="/analytics/employees"   element={<EmployeesAnalyticsPage />} />
              <Route path="/analytics/departments" element={<DepartmentsAnalyticsPage />} />
            </Route>
            {/* </Route> */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}