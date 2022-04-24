import request from '@/utils/request'
import { Purchase, PurchaseAttrs, PurchaseConditions } from './types/purchase'
import { PageResult } from '../types'

export const createPurchase = (data: PurchaseAttrs) => {
  return request<Purchase>({
    method: 'POST',
    url: '/inventory/purchases',
    data
  })
}

export const getPurchasesByConditions = (params?: PurchaseConditions) => {
  return request<PageResult>({
    method: 'GET',
    url: '/inventory/purchases/by-conditions',
    params
  })
}

export const deletePurchase = (id: number) => {
  return request<Purchase>({
    method: 'DELETE',
    url: `/inventory/purchases/${id}`
  })
}
