import request from '@/utils/request'
import { OperType, OperTypeAttrs, OperTypeConditions } from './types/opertype'
import { PageResult } from '../types'

export const getAllOperTypes = () => {
  return request<PageResult>({
    method: 'GET',
    url: '/forest/opertypes'
  })
}

export const getOperTypesByConditions = (params: OperTypeConditions) => {
  return request<PageResult>({
    method: 'GET',
    url: '/forest/opertypes/by-conditions',
    params
  })
}

export const deleteOperType = (id: number) => {
  return request<OperType>({
    method: 'DELETE',
    url: `/forest/opertypes/${id}`
  })
}

export const getOperTypeById = (id: number) => {
  return request<OperType>({
    method: 'GET',
    url: `/forest/opertypes/${id}`
  })
}

export const createOperType = (data: OperTypeAttrs) => {
  return request<OperType>({
    method: 'POST',
    url: '/forest/opertypes',
    data
  })
}

export const updateOperType = (id: number, data: OperTypeAttrs) => {
  return request<OperType>({
    method: 'PATCH',
    url: `/forest/opertypes/${id}`,
    data
  })
}
