import { Action } from './action'

export interface Permission {
  id: number
  name: string
  value: string
  label: string
  actions: Action[]
  createdAt: Date
  updatedAt: Date
}

export interface PermissionConditions {
  name?: string
  page?: number
  size?: number
}

export interface PermissionAttrs {
  name: string
  value: string
  label: string
  actionIds?: number[]
}
