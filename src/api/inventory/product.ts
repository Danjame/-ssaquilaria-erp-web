import request from '@/utils/request'
import { Product } from './types/product'

interface ProductConditions {
  name?: string
  categoryId?: number
  page?: number
  size?: number
}

interface ProductAttrs {
  name: string
  size: string
  description: string
  serialNum: string
  machineCode: string
  warnQty: string
}

export const createProduct = (data: ProductAttrs) => {
  return request<Product>({
    method: 'POST',
    url: '/inventory/products/',
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

export const updateProduct = (id: number, data: ProductAttrs) => {
  return request<Product>({
    method: 'PATCH',
    url: `/inventory/products/${id}`,
    data
  })
}

export const deleteProductById = (id: number) => {
  return request<Product>({
    method: 'DELETE',
    url: `/inventory/products/${id}`
  })
}
