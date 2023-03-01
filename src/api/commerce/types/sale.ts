import { ChangeAttrs } from './change'
import { Commodity } from './commodity'

interface Article {
  serialNum: string
  salePrice: number
  name: string
  size: string
  weight: string
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
  resume: any
}

export interface SaleConditions {
  orderNum?: number
  productId?: number
  page?: number
  size?: number
}

export interface SaleAttrs {
  customer: string
  goods: Article[]
  quantity: number
  amount: number
  remark: string
}

export interface SaleChange {
  customer: string
  remark: string
  change: ChangeAttrs
}
