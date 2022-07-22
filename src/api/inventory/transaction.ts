import request from '@/utils/request'
import { MaterialTransactionAttrs, ProductTransactionAttrs, SeedlingTransactionAttrs, Transaction, TransactionConditions } from './types/transaction'
import { PageResult } from '../types'

export const getTransactionsByConditions = (params?: TransactionConditions) => {
  return request<PageResult<Transaction>>({
    method: 'GET',
    url: '/inventory/transactions/by-conditions',
    params
  })
}

export const deleteTransaction = (id: number) => {
  return request<Transaction>({
    method: 'DELETE',
    url: `/inventory/transactions/${id}`
  })
}

export const getTransactionById = (id: number) => {
  return request<Transaction>({
    method: 'GET',
    url: `/inventory/transactions/${id}`
  })
}

export const createProductTransaction = (data: ProductTransactionAttrs) => {
  return request<Transaction>({
    method: 'POST',
    url: '/inventory/transactions/products',
    data
  })
}

export const createMaterialTransaction = (data: MaterialTransactionAttrs) => {
  return request<Transaction>({
    method: 'POST',
    url: '/inventory/transactions/materials',
    data
  })
}

export const createSeedlingTransaction = (data: SeedlingTransactionAttrs) => {
  return request<Transaction>({
    method: 'POST',
    url: '/inventory/transactions/seedlings',
    data
  })
}
