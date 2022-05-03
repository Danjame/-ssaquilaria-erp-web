import request from '@/utils/request'
import { Farm, FarmAttrs, FarmConditions } from './types/farm'
import { PageResult } from '../types'

export const getAllFarms = () => {
  return request<Farm[]>({
    method: 'GET',
    url: '/forest/farms'
  })
}

export const getFarmsByConditions = (params: FarmConditions) => {
  return request<PageResult<Farm>>({
    method: 'GET',
    url: '/forest/farms/by-conditions',
    params
  })
}

export const deleteFarm = (id: number) => {
  return request<Farm>({
    method: 'DELETE',
    url: `/forest/farms/${id}`
  })
}

export const getFarmById = (id: number) => {
  return request<Farm>({
    method: 'GET',
    url: `/forest/farms/${id}`
  })
}

export const createFarm = (data: FarmAttrs) => {
  return request<Farm>({
    method: 'POST',
    url: '/forest/farms',
    data
  })
}

export const updateFarm = (id: number, data: FarmAttrs) => {
  return request<Farm>({
    method: 'PATCH',
    url: `/forest/farms/${id}`,
    data
  })
}
