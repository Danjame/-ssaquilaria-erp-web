import request from '@/utils/request'
import { Sale, SaleAttrs, SaleConditions } from './types/sale'
import { PageResult } from '../types'
import { ChangeAttrs } from './types/change'

export const getSalesByConditions = (params?: SaleConditions) => {
  return request<PageResult<Sale>>({
    method: 'GET',
    url: '/commerce/sales/by-conditions',
    params
  })
}

export const getSaleById = (id: number) => {
  return request<PageResult<Sale>>({
    method: 'GET',
    url: `/commerce/sales/${id}`
  })
}

export const deleteSale = (id: number) => {
  return request<Sale>({
    method: 'DELETE',
    url: `/commerce/sales/${id}`
  })
}

export const createSale = (data: SaleAttrs) => {
  return request<Sale>({
    method: 'POST',
    url: '/commerce/sales',
    data
  })
}

export const addChangeToSale = (id: number, data: ChangeAttrs) => {
  return request<Sale>({
    method: 'PATCH',
    url: `/commerce/sales/${id}`,
    data
  })
}
