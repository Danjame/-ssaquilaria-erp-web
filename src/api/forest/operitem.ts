import request from '@/utils/request'
import { OperItem, OperItemAttrs, OperItemConditions } from './types/operitem'
import { PageResult } from '../types'

export const getOperItemsByOperType = (id: number) => {
  return request<OperItem[]>({
    method: 'GET',
    url: `/forest/operitems/by-opertype/${id}`
  })
}

export const getOperItemsByConditions = (params: OperItemConditions) => {
  return request<PageResult<OperItem>>({
    method: 'GET',
    url: '/forest/operitems/by-conditions',
    params
  })
}

export const deleteOperItem = (id: number) => {
  return request<OperItem>({
    method: 'DELETE',
    url: `/forest/operitems/${id}`
  })
}

export const getOperItemById = (id: number) => {
  return request<OperItem>({
    method: 'GET',
    url: `/forest/operitems/${id}`
  })
}

export const createOperItem = (data: OperItemAttrs) => {
  return request<OperItem>({
    method: 'POST',
    url: '/forest/operitems',
    data
  })
}

export const updateOperItem = (id: number, data: OperItemAttrs) => {
  return request<OperItem>({
    method: 'PATCH',
    url: `/forest/operitems/${id}`,
    data
  })
}
