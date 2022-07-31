import { getRequest, putRequest } from '../utils/request'

const BASE_URL = '/content'

export interface IBlogContent {
  id: string;
  fileId: string;
  text: string;
  createTime: Date;
  lastUpdateTime: Date;
}

export function getByFileId (fileId: string) {
  const url = BASE_URL + `/${fileId}/getByFileId`
  return getRequest(url)
}

export function updateText (data: IBlogContent) {
  const url = BASE_URL + '/updateText'
  return putRequest(url, data)
}
