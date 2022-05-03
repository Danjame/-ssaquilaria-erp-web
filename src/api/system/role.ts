import request from '@/utils/request'
import { Role, RoleAttrs, RoleConditions } from './types/role'
import { PageResult } from '../types'

export const getAllRoles = () => {
  return request<Role[]>({
    method: 'GET',
    url: '/system/roles'
  })
}

export const getRolesByConditions = (params?: RoleConditions) => {
  return request<PageResult<Role>>({
    method: 'GET',
    url: '/system/roles/by-conditions',
    params
  })
}

export const deleteRole = (id: number) => {
  return request<Role>({
    method: 'DELETE',
    url: `/system/roles/${id}`
  })
}

export const getRoleById = (id: number) => {
  return request<Role>({
    method: 'GET',
    url: `/system/roles/${id}`
  })
}

export const createRole = (data: RoleAttrs) => {
  return request<Role>({
    method: 'POST',
    url: '/system/roles',
    data
  })
}

export const updateRole = (id: number, data: RoleAttrs) => {
  return request<Role>({
    method: 'PATCH',
    url: `/system/roles/${id}`,
    data
  })
}
