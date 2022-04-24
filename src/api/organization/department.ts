import request from '@/utils/request'
import { Department, DepartmentAttrs, DepartmentConditions } from './types/department'
import { PageResult } from '../types'

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
  return request<PageResult>({
    method: 'GET',
    url: '/organization/departments/by-conditions',
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
