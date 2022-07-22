export interface Rank {
  id: number
  name: string
  specification: string
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface RankConditions {
  page?: number
  size?: number
}

export interface RankAttrs {
  name: string
  specification?: string
  remark?: string;
}
