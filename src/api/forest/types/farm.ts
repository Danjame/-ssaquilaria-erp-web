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

export interface FarmAttrs {
  name: string
  province: string
  city: string
  district: string
  remark: string
}

export interface FarmConditions{
  name?: string
  province?: string
  city?: string
  district?: string
  page?: number
  size?: number
}
