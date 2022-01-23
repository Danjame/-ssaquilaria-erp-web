import request from '@/utils/request'
import { Menu } from './types/menu'

interface User {
  username: string;
  password: string;
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/auth/login',
    data
  })
}

export const getCurrentUser = () => {
  return request<{
    name: string,
    email: string,
    menuTrees: Menu[]
  }>({
    method: 'GET',
    url: '/system/users/current-user'
  })
}
