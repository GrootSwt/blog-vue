import { getRequest, IResponse } from '../utils/request'
import Base from './base'
const BASE_URL = '/route'

export interface IBlogRoute extends Base{
  parentId: string;
  name: string;
  path: string;
  children: Array<IBlogRoute>;
}

export interface IBlogRouteData extends IResponse {
  data: Array<IBlogRoute>
}
export function getRouteTree (): Promise<IBlogRouteData> {
  return getRequest(BASE_URL + '/getRouteTree') as Promise<IBlogRouteData> 
}
