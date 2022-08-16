import request from '@/utils/request'
import { Cultivation, CultivationConditions } from './types/cultivation'
import { PageResult } from '../types'

export const getCultivationsByConditions = (params?: CultivationConditions) => {
  return request<PageResult<Cultivation>>({
    method: 'GET',
    url: '/nursery/cultivations/by-conditions',
    params
  })
}

export const deleteCultivation = (id: number) => {
  return request<Cultivation>({
    method: 'DELETE',
    url: `/nursery/cultivations/${id}`
  })
}
