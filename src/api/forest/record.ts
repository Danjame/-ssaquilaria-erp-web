import request from '@/utils/request'
import { RecordConditions } from './types/record'
import { PageResult } from '../types'

export const getRecordsByConditions = (params: RecordConditions) => {
  return request<PageResult>({
    method: 'GET',
    url: '/forest/records/by-conditions',
    params
  })
}
