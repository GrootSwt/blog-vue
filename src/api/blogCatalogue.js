import { deleteRequest, getRequest, postRequest } from '@/utils/request'

const BASE_URL = '/catalogue'

export function getBlogCatalogueTree (category) {
  const url = BASE_URL + `/${category}/getCatalogueTree`
  return getRequest(url)
}

export function createCatalogue (data) {
  const url = BASE_URL + '/createCatalogue'
  return postRequest(url, data)
}

export function deleteByIdArr (data) {
  const url = BASE_URL + `/${data.category}/deleteByIdArr?idArr=${data.idArr}`
  return deleteRequest(url)
}
