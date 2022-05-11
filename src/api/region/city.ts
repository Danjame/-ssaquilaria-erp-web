import request from '@/utils/request'
import { City } from './types/city'

export const getCitiesByProvince = (provinceCode: number) => {
  return request<City[]>({
    method: 'GET',
    url: '/region/cities',
    params: {
      provinceCode
    }
  })
}
