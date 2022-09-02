import request from '@/utils/request'
import { Commodity, CommodityAttrs, CommodityConditions } from './types/commodity'
import { PageResult } from '../types'

export const getCommoditiesByConditions = (params?: CommodityConditions) => {
  return request<PageResult<Commodity>>({
    method: 'GET',
    url: '/commerce/commodities/by-conditions',
    params
  })
}

export const getCommoditiesBySerialNums = (data: string[]) => {
  return request<Commodity[]>({
    method: 'POST',
    url: '/commerce/commodities/by-serial-numbers/validate',
    data
  })
}

export const deleteCommodity = (id: number) => {
  return request<Commodity>({
    method: 'DELETE',
    url: `/commerce/commodities/${id}`
  })
}

export const getCommodityById = (id: number) => {
  return request<Commodity>({
    method: 'GET',
    url: `/commerce/commodities/${id}`
  })
}

export const getCommodityBySerialNum = (serialNum: string) => {
  return request<Commodity>({
    method: 'GET',
    url: `/commerce/commodities/by-serial-number/${serialNum}`
  })
}

export const updateCommodity = (id: number, data: CommodityAttrs) => {
  return request<Commodity>({
    method: 'PATCH',
    url: `/commerce/commodities/${id}`,
    data
  })
}
