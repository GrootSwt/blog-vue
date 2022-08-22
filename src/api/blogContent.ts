import { getRequest, IResponse, putRequest } from '../utils/request'
import IBaseBean from './base';

const BASE_URL = '/content'

export interface IBlogContent extends IBaseBean {
  fileId: string;
  text: string;
}

export interface IBlogContentData extends IResponse {
  data?: IBlogContent;
}

export function getByFileId (fileId: string): Promise<IBlogContentData> {
  const url = BASE_URL + `/${fileId}/getByFileId`
  return getRequest(url)
}

export function updateText (data: IBlogContent): Promise<IBlogContentData>{
  const url = BASE_URL + '/updateText'
  return putRequest(url, data)
}
