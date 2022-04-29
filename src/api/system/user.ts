import request from '@/utils/request'
import { Auth, User, UserAttrs, UserConditions } from './types/user'
import { Menu } from './types/menu'
import { PageResult } from '../types'

export const login = (data: Auth) => {
  return request({
    method: 'POST',
    url: '/auth/login',
    data
  })
}

export const getUserInfo = () => {
  return request<{
    name: string,
    email: string,
    menuTrees: Menu[]
  }>({
    method: 'GET',
    url: '/system/users/current-user'
  })
}

export const getAllUsers = () => {
  return request<User[]>({
    method: 'GET',
    url: '/system/users'
  })
}

export const getUsersByConditions = (params?: UserConditions) => {
  return request<PageResult>({
    method: 'GET',
    url: '/system/users/by-conditions',
    params
  })
}

export const deleteUser = (id: number) => {
  return request<User>({
    method: 'DELETE',
    url: `/system/users/${id}`
  })
}

export const getUserById = (id: number) => {
  return request<User>({
    method: 'GET',
    url: `/system/users/${id}`
  })
}

export const createUser = (data: UserAttrs) => {
  return request<User>({
    method: 'POST',
    url: '/system/users',
    data
  })
}

export const updateUser = (id: number, data: UserAttrs) => {
  return request<User>({
    method: 'PATCH',
    url: `/system/users/${id}`,
    data
  })
}
