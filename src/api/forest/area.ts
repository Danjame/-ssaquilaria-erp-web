import request from '@/utils/request'
import { Area } from './types/area'

export const getAreasByFarmId = (id: number) => {
  return request<Area[]>({
    method: 'GET',
    url: `/forest/areas/by-farm/${id}`
  })
}
