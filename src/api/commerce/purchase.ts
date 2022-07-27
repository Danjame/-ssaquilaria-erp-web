import request from '@/utils/request'
import { Purchase, PurchaseAttrs, PurchaseConditions } from './types/purchase'
import { PageResult } from '../types'

export const getPurchasesByConditions = (params?: PurchaseConditions) => {
  return request<PageResult<Purchase>>({
    method: 'GET',
    url: '/commerce/purchases/by-conditions',
    params
  })
}

export const deletePurchase = (id: number) => {
  return request<Purchase>({
    method: 'DELETE',
    url: `/commerce/purchases/${id}`
  })
}

export const createPurchase = (data: PurchaseAttrs) => {
  return request<Purchase>({
    method: 'POST',
    url: '/commerce/purchases',
    data
  })
}
