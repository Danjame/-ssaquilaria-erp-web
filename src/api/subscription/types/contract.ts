
import { Tree } from '@/api/forest/types/tree';

export interface Contract {
  id: number
  contractNo: string
  treeName: string
  treeCount: number
  treeFarm: string
  treeArea: string
  trees: Tree[]
  subscriberName: string
  subscriberID: string
  subscriberPhone: string
  startDate: string
  endDate: string
  createdAt: Date
  updatedAt: Date
}

export interface ContractConditions {
  contractNo?: string
  subscriberName?: string
  subscriberID?: string
  subscriberPhone?: string
  page?: number
  size?: number
}

export interface ContractAttrs {
  contractNo?: string
  treeName?: string
  treeSerials?: string[]
  serials?: string
  treeCount?: number
  treeFarm?: string
  treeArea?: string
  subscriberName?: string
  subscriberID?: string
  subscriberPhone?: string
  startDate: string
  endDate: string
}
