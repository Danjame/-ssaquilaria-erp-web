import request from '@/utils/request'
import { Supplier, SupplierAttrs, SupplierConditions } from './types/supplier'
import { PageResult } from '../types'

export const getAllSuppliers = () => {
  return request<Supplier[]>({
    method: 'GET',
    url: '/commerce/suppliers'
  })
}

export const getSuppliersByConditions = (params?: SupplierConditions) => {
  return request<PageResult<Supplier>>({
    method: 'GET',
    url: '/commerce/suppliers/by-conditions',
    params
  })
}

export const deleteSupplier = (id: number) => {
  return request<Supplier>({
    method: 'DELETE',
    url: `/commerce/suppliers/${id}`
  })
}

export const getSupplierById = (id: number) => {
  return request<Supplier>({
    method: 'GET',
    url: `/commerce/suppliers/${id}`
  })
}

export const createSupplier = (data: SupplierAttrs) => {
  return request<Supplier>({
    method: 'POST',
    url: '/commerce/suppliers',
    data
  })
}

export const updateSupplier = (id: number, data: SupplierAttrs) => {
  return request<Supplier>({
    method: 'PATCH',
    url: `/commerce/suppliers/${id}`,
    data
  })
}
