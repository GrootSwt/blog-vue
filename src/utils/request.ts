import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 100000
})

interface IData {
  [prop: string]: any;
}

export enum ResponseStatus {
  SUCCESS = 'success',
  FAILURE = 'failure'
}

export interface IResponse {
  status: ResponseStatus;
  message: string;
}

export function getRequest (url: string, data: IData = {}): Promise<IResponse> {
  return new Promise((resolve, reject) => {
    instance.get(url, {
      params: data
    }).then(res => {
      const { data } = res
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function postRequest (url: string, data: IData = {}): Promise<IResponse> {
  return new Promise((resolve, reject) => {
    instance.post(url, data).then(res => {
      const { data } = res
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function deleteRequest (url: string, data: IData = {}): Promise<IResponse> {
  return new Promise((resolve, reject) => {
    instance.delete(url, {
      params: data
    }).then(res => {
      const { data } = res
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function putRequest (url: string, data: IData = {}): Promise<IResponse> {
  return new Promise((resolve, reject) => {
    instance.put(url, data).then(res => {
      const { data } = res
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}
