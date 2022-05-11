import request from '@/utils/request'
import { Province } from './types/province'

export const getAllProvinces = () => {
  return request<Province[]>({
    method: 'GET',
    url: '/region/provinces'
  })
}
