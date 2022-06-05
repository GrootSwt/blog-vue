import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 100000
})

export function getRequest (url, data = {}) {
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

export function postRequest (url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url, data).then(res => {
      const { data } = res
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function deleteRequest (url, data = {}) {
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

export function putRequest (url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.put(url, data).then(res => {
      const { data } = res
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}
