import request from '@/utils/request'
import { Product, ProductAttrs, ProductConditions } from './types/product'
import { PageResult } from '../types'

export const getAllProducts = () => {
  return request<Product[]>({
    method: 'GET',
    url: '/manufacture/products'
  })
}

export const getProductsByConditions = (params?: ProductConditions) => {
  return request<PageResult<Product>>({
    method: 'GET',
    url: '/manufacture/products/by-conditions',
    params
  })
}

export const deleteProduct = (id: number) => {
  return request<Product>({
    method: 'DELETE',
    url: `/manufacture/products/${id}`
  })
}

export const getProductById = (id: number) => {
  return request<Product>({
    method: 'GET',
    url: `/manufacture/products/${id}`
  })
}

export const createProduct = (data: ProductAttrs) => {
  return request<Product>({
    method: 'POST',
    url: '/manufacture/products',
    data
  })
}

export const updateProduct = (id: number, data: ProductAttrs) => {
  return request<Product>({
    method: 'PATCH',
    url: `/manufacture/products/${id}`,
    data
  })
}
