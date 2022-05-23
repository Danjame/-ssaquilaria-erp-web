import request from '@/utils/request'

export const downloadTemplate = async () => {
  const blob = await request({
    method: 'GET',
    url: '/file/excels/download/template',
    responseType: 'blob'
  })

  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = href
  a.download = '批量上传模版'
  a.click()
  URL.revokeObjectURL(a.href)
}
