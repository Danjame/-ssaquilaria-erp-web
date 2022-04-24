import request from '@/utils/request'
import { Action } from './types/action'

export const getAllActions = () => {
  return request<Action[]>({
    method: 'GET',
    url: '/system/actions'
  })
}
