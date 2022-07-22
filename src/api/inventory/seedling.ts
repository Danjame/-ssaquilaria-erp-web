import request from '@/utils/request'
import { Seedling, SeedlingAttrs, SeedlingConditions } from './types/seedling'
import { PageResult } from '../types'

export const getAllSeedlings = () => {
  return request<Seedling[]>({
    method: 'GET',
    url: '/inventory/seedlings'
  })
}

export const getSeedlingsByConditions = (params?: SeedlingConditions) => {
  return request<PageResult<Seedling>>({
    method: 'GET',
    url: '/inventory/seedlings/by-conditions',
    params
  })
}

export const deleteSeedling = (id: number) => {
  return request<Seedling>({
    method: 'DELETE',
    url: `/inventory/seedlings/${id}`
  })
}

export const getSeedlingById = (id: number) => {
  return request<Seedling>({
    method: 'GET',
    url: `/inventory/seedlings/${id}`
  })
}

export const createSeedling = (data: SeedlingAttrs) => {
  return request<Seedling>({
    method: 'POST',
    url: '/inventory/seedlings',
    data
  })
}

export const updateSeedling = (id: number, data: SeedlingAttrs) => {
  return request<Seedling>({
    method: 'PATCH',
    url: `/inventory/seedlings/${id}`,
    data
  })
}
