import request from '@/utils/request'
import { Plant, PlantAttrs, PlantConditions } from './types/Plant'
import { PageResult } from '../types'

export const getAllPlants = () => {
  return request<Plant[]>({
    method: 'GET',
    url: '/nursery/plants'
  })
}

export const getPlantsByConditions = (params?: PlantConditions) => {
  return request<PageResult<Plant>>({
    method: 'GET',
    url: '/nursery/plants/by-conditions',
    params
  })
}

export const deletePlant = (id: number) => {
  return request<Plant>({
    method: 'DELETE',
    url: `/nursery/plants/${id}`
  })
}

export const getPlantById = (id: number) => {
  return request<Plant>({
    method: 'GET',
    url: `/nursery/plants/${id}`
  })
}

export const createPlant = (data: PlantAttrs) => {
  return request<Plant>({
    method: 'POST',
    url: '/nursery/plants',
    data
  })
}

export const updatePlant = (id: number, data: PlantAttrs) => {
  return request<Plant>({
    method: 'PATCH',
    url: `/nursery/plants/${id}`,
    data
  })
}
