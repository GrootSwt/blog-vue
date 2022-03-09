import { getRequest, putRequest } from '@/utils/request'

const BASE_URL = '/content'

export function getByFileId (fileId) {
  const url = BASE_URL + `/${fileId}/getByFileId`
  return getRequest(url)
}

export function updateText (data) {
  const url = BASE_URL + '/updateText'
  return putRequest(url, data)
}
