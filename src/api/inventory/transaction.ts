import request from '@/utils/request'
import { Transaction, TransactionAttrs, TransactionConditions } from './types/transaction'
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

export const createTransaction = (data: TransactionAttrs) => {
  return request<Transaction>({
    method: 'POST',
    url: '/inventory/transactions',
    data
  })
}

export const updateTransaction = (id: number, data: TransactionAttrs) => {
  return request<Transaction>({
    method: 'PATCH',
    url: `/inventory/transactions/${id}`,
    data
  })
}
