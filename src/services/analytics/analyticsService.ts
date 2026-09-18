import apiClient from './../axiosConfig';
import type { ApiResponse } from '../../types/employee.types';

export interface AnalyticsSummary {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  hiresLast30Days: number;
}

export interface DepartmentHeadcount {
  id: string;
  name: string;
  employeeCount: number;
}

export interface DepartmentAverageSalary {
  id: string;
  name: string;
  averageSalary: number;
}

export interface MonthlyHire {
  month: string;   // "YYYY-MM"
  hires: number;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const res = await apiClient.get<ApiResponse<AnalyticsSummary>>('/analytics/summary');
  return res.data.data;
}

export async function getEmployeesByDepartment(): Promise<DepartmentHeadcount[]> {
  const res = await apiClient.get<ApiResponse<DepartmentHeadcount[]>>('/analytics/employees/by-department');
  return res.data.data;
}

export async function getHiresByMonth(months = 12): Promise<MonthlyHire[]> {
  const res = await apiClient.get<ApiResponse<MonthlyHire[]>>('/analytics/employees/hires-by-month', {
    params: { months },
  });
  return res.data.data;
}

export async function getAverageSalaryByDepartment(): Promise<DepartmentAverageSalary[]> {
  const res = await apiClient.get<ApiResponse<DepartmentAverageSalary[]>>('/analytics/departments/average-salary');
  return res.data.data;
}