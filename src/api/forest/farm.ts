import request from '@/utils/request'
import { PageResult } from '../types'
import { Farm, FarmAttrs, FarmConditions } from './types/farm'

export const createFarm = (data: FarmAttrs) => {
  return request<Farm>({
    method: 'POST',
    url: '/forest/farms',
    data
  })
}

export const getAllFarms = () => {
  return request<Farm[]>({
    method: 'GET',
    url: '/forest/farms'
  })
}

export const getFarmById = (id: number) => {
  return request<Farm>({
    method: 'GET',
    url: `/forest/farms/${id}`
  })
}

export const getFarmsByConditions = (params: FarmConditions) => {
  return request<PageResult>({
    method: 'GET',
    url: '/forest/farms/by-conditions',
    params
  })
}

export const updateFarm = (id: number, data: FarmAttrs) => {
  return request<Farm>({
    method: 'PATCH',
    url: `/forest/farms/${id}`,
    data
  })
}

export const deleteFarm = (id: number) => {
  return request<Farm>({
    method: 'DELETE',
    url: `/forest/farms/${id}`
  })
}
