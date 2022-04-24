import { Farm } from './farm'

export interface Area {
  id: number
  name: string
  farm: Farm
  remark: string
  createdAt: Date
  updatedAt: Date
}
