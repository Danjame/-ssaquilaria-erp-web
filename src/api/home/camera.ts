import axios, { AxiosPromise } from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_CAMERA_URL as string
})

const appKey = import.meta.env.VITE_CAMERA_APPKEY as string
const appSecret = import.meta.env.VITE_CAMERA_APPSECRET as string

export const getCameraAccessToken = (): AxiosPromise => {
  return request({
    method: 'POST',
    url: `/token/get?appKey=${appKey}&appSecret=${appSecret}`,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  })
}

export const getCameraChannels = (accessToken: string, deviceSerial: string): AxiosPromise => {
  return request({
    method: 'POST',
    url: `/device/camera/list?accessToken=${accessToken}&deviceSerial=${deviceSerial}`,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
  })
}
