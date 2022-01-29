import request from '@/utils/request'
import { Supplier } from './types/supplier'

export const getAllSuppliers = () => {
  return request<Supplier[]>({
    method: 'GET',
    url: '/inventory/suppliers'
  })
}
