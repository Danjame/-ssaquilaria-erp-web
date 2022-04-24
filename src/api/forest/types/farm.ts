import { Area } from './area'

export interface Farm{
  id: number
  name: string
  province: string
  city: string
  district: string
  areas: Area[]
  remark: string
}
