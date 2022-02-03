import request from '@/utils/request'
import { Sale } from './types/sale'

interface SaleAttrs {
  orderNum: string
  productId: number | undefined
  customerId?: number | undefined
  price: number
  quantity: number
  amount: number
  comment: string
}

interface SaleConditions {
  orderNum?: number
  productId?: number
  page?: number
  size?: number
}

export const createSale = (data: SaleAttrs) => {
  return request<Sale>({
    method: 'POST',
    url: '/inventory/sales',
    data
  })
}

export const getSalesByConditions = (params?: SaleConditions) => {
  return request<{
    results: Sale[],
    size: number,
    page: number,
    total: number
  }>({
    method: 'GET',
    url: '/inventory/sales/conditions',
    params
  })
}

export const deleteSale = (id: number) => {
  return request<Sale>({
    method: 'DELETE',
    url: `/inventory/sales/${id}`
  })
}
