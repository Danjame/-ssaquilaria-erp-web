import request from '@/utils/request'
import { Supplier } from './types/supplier'

interface SupplierAttrs {
  name: string
  value: string
  label: string
  description?: string
}

interface SupplierConditions {
  productId?: number
  page?: number
  size?: number
}

export const createSupplier = (data: SupplierAttrs) => {
  return request<Supplier>({
    method: 'POST',
    url: '/inventory/suppliers',
    data
  })
}

export const getSupplierById = (id: number) => {
  return request<Supplier>({
    method: 'GET',
    url: `/inventory/suppliers/${id}`
  })
}

export const getAllSuppliers = () => {
  return request<Supplier[]>({
    method: 'GET',
    url: '/inventory/suppliers'
  })
}

export const getSuppliersByConditions = (params?: SupplierConditions) => {
  return request<{
    results: Supplier[],
    size: number,
    page: number,
    total: number
  }>({
    method: 'GET',
    url: '/inventory/suppliers/conditions',
    params
  })
}

export const updateSupplier = (id: number, data: SupplierAttrs) => {
  return request<Supplier>({
    method: 'PATCH',
    url: `/inventory/suppliers/${id}`,
    data
  })
}

export const deleteSupplier = (id: number) => {
  return request<Supplier>({
    method: 'DELETE',
    url: `/inventory/suppliers/${id}`
  })
}
