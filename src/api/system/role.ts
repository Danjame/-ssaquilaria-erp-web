import request from '@/utils/request'
import { AxiosPromise } from 'axios'

export const getRoleInfo = (id: number): AxiosPromise => {
  return request({
    method: 'GET',
    url: `/system/roles/${id}`
  })
}
