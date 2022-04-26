import request from '@/utils/request'
import { OperItem } from './types/operitem'

export const getOperItemsByOperTypeId = (id: number) => {
  return request<OperItem[]>({
    method: 'GET',
    url: `/forest/operitems/by-opertype/${id}`
  })
}
