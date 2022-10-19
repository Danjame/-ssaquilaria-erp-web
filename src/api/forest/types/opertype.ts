import { OperItem } from './operitem'

export interface OperType {
  id: number
  name: string
  value: string
  operItems: OperItem[]
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface OperTypeConditions{
  page?: number
  size?: number
}

export interface OperTypeAttrs {
  name: string
  value: string
  remark: string
}
