import request from '@/utils/request'
import { Category, CategoryAttrs, CategoryConditions } from './types/category'
import { PageResult } from '../types'

export const getAllCategories = () => {
  return request<Category[]>({
    method: 'GET',
    url: '/manufacture/categories'
  })
}

export const getCategoriesByConditions = (params?: CategoryConditions) => {
  return request<PageResult<Category>>({
    method: 'GET',
    url: '/manufacture/categories/by-conditions',
    params
  })
}

export const deleteCategory = (id: number) => {
  return request<Category>({
    method: 'DELETE',
    url: `/manufacture/categories/${id}`
  })
}

export const getCategoryById = (id: number) => {
  return request<Category>({
    method: 'GET',
    url: `/manufacture/categories/${id}`
  })
}

export const createCategory = (data: CategoryAttrs) => {
  return request<Category>({
    method: 'POST',
    url: '/manufacture/categories',
    data
  })
}

export const updateCategory = (id: number, data: CategoryAttrs) => {
  return request<Category>({
    method: 'PATCH',
    url: `/manufacture/categories/${id}`,
    data
  })
}
