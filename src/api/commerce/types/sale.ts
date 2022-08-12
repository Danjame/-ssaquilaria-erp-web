import { Commodity } from './commodity'

interface Goods {
  serialNum: string
  price: number
}

export interface Sale {
  id: number
  orderNum: string
  customer: string
  commodities: Commodity[]
  quantity: number
  amount: number
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface SaleConditions {
  orderNum?: number
  productId?: number
  page?: number
  size?: number
}

export interface SaleAttrs {
  customer: string
  goods: Goods[]
  remark: string
}
