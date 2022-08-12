import { Sale } from './sale'

export interface Change {
  id: number
  return: string[]
  leave: string[]
  refund: number[]
  charge: number[]
  amount: number
  sale: Sale
  createdAt: Date
  updatedAt: Date
}

export interface ChangeAttrs {
  return: string[]
  leave: string[]
  refund: number[]
  charge: number[]
}
