import request from '@/utils/request'
import { Unit } from './types/unit'

interface UnitAttrs {
  name: string
  value: string
  label: string
  description?: string
}

interface UnitConditions {
  page?: number
  size?: number
}

export const createUnit = (data: UnitAttrs) => {
  return request<Unit>({
    method: 'POST',
    url: '/inventory/units',
    data
  })
}

export const getUnitById = (id: number) => {
  return request<Unit>({
    method: 'GET',
    url: `/inventory/units/${id}`
  })
}

export const getAllUnits = () => {
  return request<Unit[]>({
    method: 'GET',
    url: '/inventory/units'
  })
}

export const getUnitsByConditions = (params?: UnitConditions) => {
  return request<{
    results: Unit[],
    size: number,
    page: number,
    total: number
  }>({
    method: 'GET',
    url: '/inventory/units/conditions'
  })
}

export const updateUnit = (id: number, data: UnitAttrs) => {
  return request<Unit>({
    method: 'PATCH',
    url: `/inventory/units/${id}`,
    data
  })
}

export const deleteUnit = (id: number) => {
  return request<Unit>({
    method: 'DELETE',
    url: `/inventory/units/${id}`
  })
}
