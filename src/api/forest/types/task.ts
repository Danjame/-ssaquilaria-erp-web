import { User } from '@/api/system/types/user'
import { Area } from './area'
import { Farm } from './farm'
import { OperItem } from './operitem'
import { OperType } from './opertype'
import { Tree } from './tree'

export interface Task {
  id: number
  taskNum: string
  farm: Farm
  area: Area
  areas: Area[]
  trees: Tree[]
  treeCount: number
  operType: OperType
  operItem: OperItem
  operData: string
  startedAt: Date
  endedAt: Date
  duration: number
  images: string[]
  srcList: string[]
  remark: string
  operator: User
  review: string
  reviewer: User
  status: number
  createdAt: Date
  updatedAt: Date
}

export interface TaskAttrs {
  status?: number
  review?: string
}

export interface TaskConditions {
  operTypeId?: number
  operItemId?: number
  status?: number
  page?: number
  size?: number
}
