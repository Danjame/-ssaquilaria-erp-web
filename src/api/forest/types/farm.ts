import { Area } from './area'

export interface Farm{
  id: number
  name: string
  province: string
  city: string
  district: string
  regionCodes: string[]
  areas: Area[]
  remark: string
}

export interface FarmConditions{
  name?: string
  province?: string
  city?: string
  district?: string
  regionCodes?: string
  page?: number
  size?: number
}

export interface FarmAttrs {
  name: string
  province: string
  city: string
  district: string
  regionCodes: string[]
  remark: string
}
