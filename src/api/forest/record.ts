import request from '@/utils/request'
import { Record, RecordConditions } from './types/record'
import { PageResult } from '../types'

export const getRecordsByTree = (params: RecordConditions) => {
  return request<PageResult<Record>>({
    method: 'GET',
    url: '/forest/records/by-conditions',
    params
  })
}
