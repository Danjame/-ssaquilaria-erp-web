import request from '@/utils/request'

export const downloadImage = async (files: string[]): Promise<string[]> => {
  const pendingFiles = files.map(file => request({
    method: 'GET',
    url: `/file/images/download/${file}`,
    responseType: 'blob'
  }))

  const resolved = await Promise.allSettled(pendingFiles)
  return resolved.map(({ value }: any) => {
    const blob = new Blob([value], { type: 'application/binary;charset=UTF-8' })
    return URL.createObjectURL(blob)
  })
}
