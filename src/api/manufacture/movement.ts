import request from '@/utils/request'
import { MaterialMovementAttrs, ProductMovementAttrs, SaplingMovementAttrs, Movement, MovementConditions } from './types/movement'
import { PageResult } from '../types'

export const getMovementsByConditions = (params?: MovementConditions) => {
  return request<PageResult<Movement>>({
    method: 'GET',
    url: '/manufacture/movements/by-conditions',
    params
  })
}

export const deleteMovement = (id: number) => {
  return request<Movement>({
    method: 'DELETE',
    url: `/manufacture/movements/${id}`
  })
}

export const getMovementById = (id: number) => {
  return request<Movement>({
    method: 'GET',
    url: `/manufacture/movements/${id}`
  })
}

export const createProductMovement = (data: ProductMovementAttrs) => {
  return request<Movement>({
    method: 'POST',
    url: '/manufacture/movements/products',
    data
  })
}

export const createMaterialMovement = (data: MaterialMovementAttrs) => {
  return request<Movement>({
    method: 'POST',
    url: '/manufacture/movements/materials',
    data
  })
}

export const createSaplingMovement = (data: SaplingMovementAttrs) => {
  return request<Movement>({
    method: 'POST',
    url: '/manufacture/movements/saplings',
    data
  })
}
