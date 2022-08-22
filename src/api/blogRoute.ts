import { getRequest, IResponse } from '../utils/request'
import IBaseBean from './base'
const BASE_URL = '/route'

export interface IBlogRoute extends IBaseBean{
  parentId: string;
  name: string;
  path: string;
  children: Array<IBlogRoute>;
}

export interface IBlogRouteData extends IResponse {
  data?: Array<IBlogRoute>
}
export function getRouteTree (): Promise<IBlogRouteData> {
  return getRequest(BASE_URL + '/getRouteTree')
}
