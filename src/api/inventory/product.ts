import request from '@/utils/request'
import { Product } from './types/product'

interface ConditionsDto {
  categoryId?: number | undefined
  size?: number
  page?: number
}

export const getProdcutsByConditions = (params?: ConditionsDto) => {
  return request<{
    results: Product[],
    size: number,
    page: number,
    total: number
  }>({
    method: 'GET',
    url: '/inventory/products/conditions',
    params
  })
}

// export const getUserInfo = (id: number): AxiosPromise<User> => {
//   return request({
//     method: 'GET',
//     url: `/system/users/${id}`
//   })
// }
