import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export function getRequest (url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.get(url, {
      params: data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
