import { Product } from '@/api/manufacture/types/product'
import { Movement } from '@/api/manufacture/types/movement'
import { Material } from '@/api/manufacture/types/material'
import { Purchase } from './purchase'
import { Sale } from './sale'
import { Client } from './client'

export interface Commodity {
  id: number
  traceNum: string
  serialNum: string
  product: Product;
  size: string;
  weight: string;
  movements: Movement[]
  fixedPrice: number
  material: Material
  materialQty: number
  purchase: Purchase
  purchasePrice: number
  sale: Sale
  salePrice: number
  client: Client
  status: string
  queryCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CommodityConditions {
  serialNum?: string
  productId?: number
  page?: number
  size?: number
}

export interface CommodityAttrs {
  size?: string
  weight?: string
  fixedPrice?: number
  purchasePrice?: number
  salePrice?: number
}
