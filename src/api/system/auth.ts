import request from '@/utils/request'
import { Auth } from './types/auth'

export const login = (data: Auth) => {
  return request({
    method: 'POST',
    url: '/auth/login/sms',
    data
  })
}

export const getSmsCode = (phone: string) => {
  return request({
    method: 'GET',
    url: `/auth/${phone}/sms-code`
  })
}
