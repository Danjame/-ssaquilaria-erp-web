import request from '@/utils/request'

const getFileBlob = (fileNum: string) => {
  return request({
    method: 'GET',
    url: `/file/images/download/${fileNum}`,
    responseType: 'blob'
  })
}

export const downloadImage = async (files: string[]) => {
  const pendingFiles = files.map(file => getFileBlob(file))
  const resolved = await Promise.allSettled(pendingFiles)
  return resolved.map(({ value }: any) => {
    const blob = new Blob([value], { type: 'application/binary;charset=UTF-8' })
    return URL.createObjectURL(blob)
  })
}
