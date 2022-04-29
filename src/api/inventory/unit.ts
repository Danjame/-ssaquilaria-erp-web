import request from '@/utils/request'
import { Unit, UnitAttrs, UnitConditions } from './types/unit'
import { PageResult } from '../types'

export const getAllUnits = () => {
  return request<Unit[]>({
    method: 'GET',
    url: '/inventory/units'
  })
}

export const getUnitsByConditions = (params?: UnitConditions) => {
  return request<PageResult>({
    method: 'GET',
    url: '/inventory/units/by-conditions',
    params
  })
}

export const deleteUnit = (id: number) => {
  return request<Unit>({
    method: 'DELETE',
    url: `/inventory/units/${id}`
  })
}

export const getUnitById = (id: number) => {
  return request<Unit>({
    method: 'GET',
    url: `/inventory/units/${id}`
  })
}

export const createUnit = (data: UnitAttrs) => {
  return request<Unit>({
    method: 'POST',
    url: '/inventory/units',
    data
  })
}

export const updateUnit = (id: number, data: UnitAttrs) => {
  return request<Unit>({
    method: 'PATCH',
    url: `/inventory/units/${id}`,
    data
  })
}
