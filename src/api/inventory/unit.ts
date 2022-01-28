import request from '@/utils/request'
import { Unit } from './types/unit'

export const getUnits = () => {
  return request<Unit[]>({
    method: 'GET',
    url: '/inventory/units'
  })
}
