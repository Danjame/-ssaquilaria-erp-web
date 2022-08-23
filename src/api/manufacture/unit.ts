import request from '@/utils/request'
import { Unit, UnitAttrs, UnitConditions } from './types/unit'
import { PageResult } from '../types'

export const getAllUnits = () => {
  return request<Unit[]>({
    method: 'GET',
    url: '/manufacture/units'
  })
}

export const getUnitsByConditions = (params?: UnitConditions) => {
  return request<PageResult<Unit>>({
    method: 'GET',
    url: '/manufacture/units/by-conditions',
    params
  })
}

export const deleteUnit = (id: number) => {
  return request<Unit>({
    method: 'DELETE',
    url: `/manufacture/units/${id}`
  })
}

export const getUnitById = (id: number) => {
  return request<Unit>({
    method: 'GET',
    url: `/manufacture/units/${id}`
  })
}

export const createUnit = (data: UnitAttrs) => {
  return request<Unit>({
    method: 'POST',
    url: '/manufacture/units',
    data
  })
}

export const updateUnit = (id: number, data: UnitAttrs) => {
  return request<Unit>({
    method: 'PATCH',
    url: `/manufacture/units/${id}`,
    data
  })
}
