import apiClient from './axiosConfig';
import type { Department, ApiResponse } from '../types/employee.types';

export async function getDepartments(): Promise<Department[]> {
  const response = await apiClient.get<ApiResponse<Department[]>>('/departments');
  return response.data.data;
}