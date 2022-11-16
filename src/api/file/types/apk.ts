export interface Apk {
  id: number
  fileNum: string
  fileName: string
  originalName: string
  dest: string
  path: string
  mimeType: string
  size: number
  version: string
  remark: string
  needUpdate: boolean
  createdAt: Date
  updatedAt: Date

  isDownLoading: boolean
  loadedPercentage: number
  cancelDownload: Function
}

export interface ApkConditions {
  version?: string
  needUpdate?: boolean
  page?: number
  size?: number
}

export interface ApkAttrs {
  version: string
  needUpdate: boolean
  remark: string
}
