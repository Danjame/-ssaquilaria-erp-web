import request from '@/utils/request'
import { Permission } from './types/permission'

interface PermissionAttrs {
  name: string
  value: string
  label: string
  actionIds?: number[]
}

interface PermissionConditions {
  name?: string
  page?: number
  size?: number
}

export const createPermission = (data: PermissionAttrs) => {
  return request<Permission>({
    method: 'POST',
    url: '/system/permissions',
    data
  })
}

export const getAllPermissions = () => {
  return request<Permission[]>({
    method: 'GET',
    url: '/system/permissions'
  })
}

export const getPermissionById = (id: number) => {
  return request<Permission>({
    method: 'GET',
    url: `/system/permissions/${id}`
  })
}

export const getPermissionsByConditions = (params?: PermissionConditions) => {
  return request<{
    results: Permission[],
    size: number,
    page: number,
    total: number
  }>({
    method: 'GET',
    url: '/system/permissions/conditions',
    params
  })
}

export const updatePermission = (id: number, data: PermissionAttrs) => {
  return request<Permission>({
    method: 'PATCH',
    url: `/system/permissions/${id}`,
    data
  })
}

export const deletePermission = (id: number) => {
  return request<Permission>({
    method: 'DELETE',
    url: `/system/permissions/${id}`
  })
}
