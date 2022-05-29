import { getRequest } from '@/utils/request'

const BASE_URL = '/route'

export function getRouteTree () {
  return getRequest(BASE_URL + '/getRouteTree')
}
