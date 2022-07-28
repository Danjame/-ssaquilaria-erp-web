import request from '@/utils/request'
import { CancelToken } from 'axios'
import { PageResult } from '../types'
import { Apk, ApkConditions } from './types/apk'

export const getApksByConditions = (params: ApkConditions) => {
  return request<PageResult<Apk>>({
    method: 'GET',
    url: '/file/apks/by-conditions',
    params
  })
}

type ProgressCallback = (progress: ProgressEvent) => void;
export const downloadApk = async (file: string, fileName: string, onDownloadProgress?: ProgressCallback, cancelToken?: CancelToken) => {
  const blob = await request({
    method: 'GET',
    url: `/file/apks/download/${file}`,
    responseType: 'blob',
    onDownloadProgress,
    cancelToken
  })

  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = href
  a.download = fileName
  a.click()
  URL.revokeObjectURL(a.href)
  a.remove()
}
