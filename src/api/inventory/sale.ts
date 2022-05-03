import request from '@/utils/request'
import { Sale, SaleAttrs, SaleConditions } from './types/sale'
import { PageResult } from '../types'

export const getSalesByConditions = (params?: SaleConditions) => {
  return request<PageResult<Sale>>({
    method: 'GET',
    url: '/inventory/sales/by-conditions',
    params
  })
}

export const deleteSale = (id: number) => {
  return request<Sale>({
    method: 'DELETE',
    url: `/inventory/sales/${id}`
  })
}

export const createSale = (data: SaleAttrs) => {
  return request<Sale>({
    method: 'POST',
    url: '/inventory/sales',
    data
  })
}
