import request from '@/utils/request'
import { User } from './types/user'
import { Menu } from './types/menu'

interface Auth {
  username: string;
  password: string;
}

interface UserAttrs {
  name?: string
  email?: string
  status?: boolean
  lastLogin?: string
  roleIds?: number[]
}

interface UserConditions {
  name?: string
  departmentId?: number
  page?: number
  size?: number
}

export const login = (data: Auth) => {
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

export const createUser = (data: UserAttrs) => {
  return request<User>({
    method: 'POST',
    url: '/system/users',
    data
  })
}

export const getAllUsers = () => {
  return request<User[]>({
    method: 'GET',
    url: '/system/users'
  })
}

export const getUserById = (id: number) => {
  return request<User>({
    method: 'GET',
    url: `/system/users/${id}`
  })
}

export const getUsersByConditions = (params?: UserConditions) => {
  return request<{
    results: User[],
    size: number,
    page: number,
    total: number
  }>({
    method: 'GET',
    url: '/system/users/conditions',
    params
  })
}

export const updateUser = (id: number, data: UserAttrs) => {
  return request<User>({
    method: 'PATCH',
    url: `/system/users/${id}`,
    data
  })
}

export const deleteUser = (id: number) => {
  return request<User>({
    method: 'DELETE',
    url: `/system/users/${id}`
  })
}
