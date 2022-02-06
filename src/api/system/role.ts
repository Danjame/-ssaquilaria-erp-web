import request from '@/utils/request'
import { Role } from './types/role'

interface RoleAttrs {
  name?: string
  value?: string
  label?: string
  permissionIds?: number[]
  menuIds?: number[]
  status?: boolean
}

interface RoleConditions {
  name?: string
  page?: number
  size?: number
}

export const createRole = (data: RoleAttrs) => {
  return request<Role>({
    method: 'POST',
    url: '/system/roles',
    data
  })
}

export const getRoleById = (id: number) => {
  return request<Role>({
    method: 'GET',
    url: `/system/roles/${id}`
  })
}

export const getAllRoles = () => {
  return request<Role[]>({
    method: 'GET',
    url: '/system/roles'
  })
}

export const getRolesByConditions = (params?: RoleConditions) => {
  return request<{
    results: Role[],
    size: number,
    page: number,
    total: number
  }>({
    method: 'GET',
    url: '/system/roles/conditions',
    params
  })
}

export const updateRole = (id: number, data: RoleAttrs) => {
  return request<Role>({
    method: 'PATCH',
    url: `/system/roles/${id}`,
    data
  })
}

export const deleteRole = (id: number) => {
  return request<Role>({
    method: 'DELETE',
    url: `/system/roles/${id}`
  })
}
