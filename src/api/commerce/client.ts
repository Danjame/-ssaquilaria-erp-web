import request from '@/utils/request'
import { Client, ClientAttrs, ClientConditions } from './types/client'
import { PageResult } from '../types'

export const getClientsByConditions = (params?: ClientConditions) => {
  return request<PageResult<Client>>({
    method: 'GET',
    url: '/commerce/clients/by-conditions',
    params
  })
}

export const getClientById = (id: number) => {
  return request<Client>({
    method: 'GET',
    url: `/commerce/clients/${id}`
  })
}

export const updateClient = (id: number, data: ClientAttrs) => {
  return request<Client>({
    method: 'PATCH',
    url: `/commerce/clients/${id}`,
    data
  })
}
