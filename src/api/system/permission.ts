import request from '@/utils/request'
import { Permission } from './types/permission'

export const getAllPermissions = () => {
  return request<Permission[]>({
    method: 'GET',
    url: '/system/permissions'
  })
}
