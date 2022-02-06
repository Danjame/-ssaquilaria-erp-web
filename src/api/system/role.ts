import request from '@/utils/request'
import { Role } from './types/role'

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
