import request from '@/utils/request'
import { Material, MaterialAttrs, MaterialConditions } from './types/material'
import { PageResult } from '../types'

export const getAllMaterials = () => {
  return request<Material[]>({
    method: 'GET',
    url: '/manufacture/materials'
  })
}

export const getMaterialsByConditions = (params?: MaterialConditions) => {
  return request<PageResult<Material>>({
    method: 'GET',
    url: '/manufacture/materials/by-conditions',
    params
  })
}

export const deleteMaterial = (id: number) => {
  return request<Material>({
    method: 'DELETE',
    url: `/manufacture/materials/${id}`
  })
}

export const getMaterialById = (id: number) => {
  return request<Material>({
    method: 'GET',
    url: `/manufacture/materials/${id}`
  })
}

export const createMaterial = (data: MaterialAttrs) => {
  return request<Material>({
    method: 'POST',
    url: '/manufacture/materials',
    data
  })
}

export const updateMaterial = (id: number, data: MaterialAttrs) => {
  return request<Material>({
    method: 'PATCH',
    url: `/manufacture/materials/${id}`,
    data
  })
}
