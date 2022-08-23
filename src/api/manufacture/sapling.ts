import request from '@/utils/request'
import { Sapling, SaplingAttrs, SaplingConditions } from './types/sapling'
import { PageResult } from '../types'

export const getAllSaplings = () => {
  return request<Sapling[]>({
    method: 'GET',
    url: '/manufacture/saplings'
  })
}

export const getSaplingsByConditions = (params?: SaplingConditions) => {
  return request<PageResult<Sapling>>({
    method: 'GET',
    url: '/manufacture/saplings/by-conditions',
    params
  })
}

export const deleteSapling = (id: number) => {
  return request<Sapling>({
    method: 'DELETE',
    url: `/manufacture/saplings/${id}`
  })
}

export const getSaplingById = (id: number) => {
  return request<Sapling>({
    method: 'GET',
    url: `/manufacture/saplings/${id}`
  })
}

export const createSapling = (data: SaplingAttrs) => {
  return request<Sapling>({
    method: 'POST',
    url: '/manufacture/saplings',
    data
  })
}

export const updateSapling = (id: number, data: SaplingAttrs) => {
  return request<Sapling>({
    method: 'PATCH',
    url: `/manufacture/saplings/${id}`,
    data
  })
}
