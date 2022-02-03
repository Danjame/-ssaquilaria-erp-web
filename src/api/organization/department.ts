import request from '@/utils/request'
import { Department } from './types/department'

interface DepartmentAttrs {
  name: string
  value: string
  label: string
}

interface DepartmentConditions {
  page?: number
  size?: number
}

export const createDepartment = (data: DepartmentAttrs) => {
  return request<Department>({
    method: 'POST',
    url: '/organization/departments',
    data
  })
}

export const getDepartmentById = (id: number) => {
  return request<Department>({
    method: 'GET',
    url: `/organization/departments/${id}`
  })
}

export const getAllDepartments = () => {
  return request<Department[]>({
    method: 'GET',
    url: '/organization/departments'
  })
}

export const getDepartmentsByConditions = (params?: DepartmentConditions) => {
  return request<{
    results: Department[],
    size: number,
    page: number,
    total: number
  }>({
    method: 'GET',
    url: '/organization/departments/conditions',
    params
  })
}

export const updateDepartment = (id: number, data: DepartmentAttrs) => {
  return request<Department>({
    method: 'PATCH',
    url: `/organization/departments/${id}`,
    data
  })
}

export const deleteDepartment = (id: number) => {
  return request<Department>({
    method: 'DELETE',
    url: `/organization/departments/${id}`
  })
}
