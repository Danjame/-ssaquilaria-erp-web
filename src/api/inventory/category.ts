import request from '@/utils/request'
import { Category } from './types/category'

interface CategoryAttrs {
  name: string
  value: string
  label: string
}

interface CategoryConditions {
  productId?: number
  page?: number
  size?: number
}

export const createCategory = (data: CategoryAttrs) => {
  return request<Category>({
    method: 'POST',
    url: '/inventory/categories',
    data
  })
}

export const getCategoryById = (id: number) => {
  return request<Category>({
    method: 'GET',
    url: `/inventory/categories/${id}`
  })
}

export const getAllCategories = () => {
  return request<Category[]>({
    method: 'GET',
    url: '/inventory/categories'
  })
}

export const getCategoriesByConditions = (params?: CategoryConditions) => {
  return request<{
    results: Category[],
    size: number,
    page: number,
    total: number
  }>({
    method: 'GET',
    url: '/inventory/categories/conditions',
    params
  })
}

export const updateCategory = (id: number, data: CategoryAttrs) => {
  return request<Category>({
    method: 'PATCH',
    url: `/inventory/categories/${id}`,
    data
  })
}

export const deleteCategory = (id: number) => {
  return request<Category>({
    method: 'DELETE',
    url: `/inventory/categories/${id}`
  })
}
