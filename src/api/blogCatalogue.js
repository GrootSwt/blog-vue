import { deleteRequest, getRequest, postRequest } from '@/utils/request'

const BASE_URL = '/catalogue'

export function getBlogCatalogueTree (category) {
  const url = BASE_URL + `/${category}/getCatalogueTree`
  return getRequest(url)
}

export function editCatalogue (data) {
  const url = BASE_URL + '/editCatalogue'
  return postRequest(url, data)
}

export function deleteByIdArr (data) {
  const url = BASE_URL + `/${data.category}/deleteByIdArr?idArr=${data.idArr}`
  return deleteRequest(url)
}

export function getNewest (category = '') {
  let url = BASE_URL + '/getNewest'
  if (category) {
    url += `?category=${category}`
  }
  return getRequest(url)
}

export function getById (id) {
  const url = BASE_URL + `/${id}/getById`
  return getRequest(url)
}
