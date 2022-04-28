import { OperType } from './opertype'

export interface OperItem {
  id: number
  name: string
  operType: OperType
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface OperItemConditions{
  operTypeId?: number
  page?: number
  size?: number
}

export interface OperItemAttrs {
  name: string
  operTypeId: number
  remark: string
}
