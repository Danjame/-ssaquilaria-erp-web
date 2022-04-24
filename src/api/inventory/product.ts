import request from '@/utils/request'
import { Product, ProductAttrs, ProductConditions } from './types/product'
import { PageResult } from '../types'

export const createProduct = (data: ProductAttrs) => {
  return request<Product>({
    method: 'POST',
    url: '/inventory/products',
    data
  })
}

export const getProductById = (id: number) => {
  return request<Product>({
    method: 'GET',
    url: `/inventory/products/${id}`
  })
}

export const getProductsByConditions = (params?: ProductConditions) => {
  return request<PageResult>({
    method: 'GET',
    url: '/inventory/products/by-conditions',
    params
  })
}

export const getAllProducts = () => {
  return request<Product[]>({
    method: 'GET',
    url: '/inventory/products'
  })
}

export const updateProduct = (id: number, data: ProductAttrs) => {
  return request<Product>({
    method: 'PATCH',
    url: `/inventory/products/${id}`,
    data
  })
}

export const deleteProduct = (id: number) => {
  return request<Product>({
    method: 'DELETE',
    url: `/inventory/products/${id}`
  })
}
