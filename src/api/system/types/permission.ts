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
