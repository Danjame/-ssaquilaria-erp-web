import request from '@/utils/request'
import { PageResult } from '../types'
import { Visit, VisitConditions } from './types/visit'

export const getVisitsByConditions = (params?: VisitConditions) => {
  return request<PageResult<Visit>>({
    method: 'GET',
    url: '/museum/visits/by-conditions',
    params
  })
}

export const deleteVisit = (id: number) => {
  return request<Visit>({
    method: 'DELETE',
    url: `/museum/visits/${id}`
  })
}

export const getVisitById = (id: number) => {
  return request<Visit>({
    method: 'GET',
    url: `/museum/visits/${id}`
  })
}
