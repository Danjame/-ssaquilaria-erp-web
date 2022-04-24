import request from '@/utils/request'
import { Farm } from './types/farm'

export const getAllFarms = () => {
  return request<Farm[]>({
    method: 'GET',
    url: '/forest/farms'
  })
}
