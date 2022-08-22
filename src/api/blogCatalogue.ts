import { deleteRequest, getRequest, IResponse, postRequest } from '../utils/request'
import IBaseBean from './base';

const BASE_URL = '/catalogue'

export interface IBlogCatalogue extends IBaseBean {
  parentId: string;
  name: string;
  type: string;
  category: string;
  children: Array<IBlogCatalogue>;
}

export interface IBlogCatalogueData extends IResponse {
  data?: IBlogCatalogue;
}

export interface IBlogCatalogueTreeData extends IResponse {
  data?: Array<IBlogCatalogue>;
}

export function getBlogCatalogueTree (category: string): Promise<IBlogCatalogueTreeData> {
  const url = BASE_URL + `/${category}/getCatalogueTree`
  return getRequest(url)
}

export function editCatalogue (data: IBlogCatalogue): Promise<IBlogCatalogueTreeData> {
  const url = BASE_URL + '/editCatalogue'
  return postRequest(url, data)
}

export function deleteByIdArr (data: { category: string; idArr: Array<string> }): Promise<IBlogCatalogueTreeData> {
  const url = BASE_URL + `/${data.category}/deleteByIdArr?idArr=${data.idArr}`
  return deleteRequest(url)
}

export function getNewest (category = ''): Promise<IBlogCatalogueTreeData> {
  let url = BASE_URL + '/getNewest'
  if (category) {
    url += `?category=${category}`
  }
  return getRequest(url)
}

export function getById (id: string): Promise<IBlogCatalogueData> {
  const url = BASE_URL + `/${id}/getById`
  return getRequest(url)
}