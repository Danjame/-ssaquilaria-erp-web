import request from '@/utils/request'
import { PageResult } from '../types'

export const getAllOperTypes = () => {
  return request<PageResult>({
    method: 'GET',
    url: '/forest/opertypes'
  })
}
