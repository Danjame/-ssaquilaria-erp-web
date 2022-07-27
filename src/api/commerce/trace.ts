import request from '@/utils/request'
import { Trace, TraceConditions } from './types/trace'
import { PageResult } from '../types'

export const getTracesByConditions = (params?: TraceConditions) => {
  return request<PageResult<Trace>>({
    method: 'GET',
    url: '/commerce/traces/by-conditions',
    params
  })
}

export const deleteTrace = (id: number) => {
  return request<Trace>({
    method: 'DELETE',
    url: `/commerce/traces/${id}`
  })
}

export const getTraceById = (id: number) => {
  return request<Trace>({
    method: 'GET',
    url: `/commerce/traces/${id}`
  })
}
