import request from '@/utils/request'
import { Area, AreaAttrs, AreaConditions } from './types/area'
import { PageResult } from '../types'

export const getAreasByFarm = (id: number) => {
  return request<Area[]>({
    method: 'GET',
    url: `/forest/areas/by-farm/${id}`
  })
}

export const getAreasByConditions = (params: AreaConditions) => {
  return request<PageResult>({
    method: 'GET',
    url: '/forest/areas/by-conditions',
    params
  })
}

export const createArea = (data: AreaAttrs) => {
  return request<Area>({
    method: 'POST',
    url: '/forest/areas',
    data
  })
}

export const getAreaById = (id: number) => {
  return request<Area>({
    method: 'GET',
    url: `/forest/areas/${id}`
  })
}

export const updateArea = (id: number, data: AreaAttrs) => {
  return request<Area>({
    method: 'PATCH',
    url: `/forest/areas/${id}`,
    data
  })
}

export const deleteArea = (id: number) => {
  return request<Area>({
    method: 'DELETE',
    url: `/forest/areas/${id}`
  })
}
