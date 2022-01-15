import request from '@/utils/request'
import { AxiosPromise } from 'axios'

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

export const getUserInfo = (id: number): AxiosPromise<User> => {
  return request({
    method: 'GET',
    url: `/system/users/${id}`
  })
}
