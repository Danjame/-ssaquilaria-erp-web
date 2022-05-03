import { User } from '@/api/system/types/user'
import { OperItem } from './operitem'
import { OperType } from './opertype'
import { Tree } from './tree'

export interface Record {
  id: number
  taskNum: string
  tree: Tree
  operType: OperType
  operItem: OperItem
  operData: string
  startedAt: Date
  endedAt: Date
  duration: number
  images: string[]
  remark: string
  operator: User
  review: string
  reviewer: User
  createdAt: Date
  updatedAt: Date
}

export interface RecordConditions {
  treeId: number
  operTypeId?: number
}
