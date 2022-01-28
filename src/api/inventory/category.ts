import request from '@/utils/request'
import { Category } from './types/category'

export const getCategories = () => {
  return request<Category[]>({
    method: 'GET',
    url: '/inventory/categories'
  })
}
