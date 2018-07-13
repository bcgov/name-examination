/* eslint-disable */
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://namex-test.pathfinder.gov.bc.ca'
})

let isAlreadyFetchingAccessToken = false
let subscribers = []

function onAccessTokenFetched(access_token) {
  subscribers = subscribers.filter(callback => callback(access_token))
}

function addSubscriber(callback) {
  subscribers.push(callback)
}

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  const { config, response: { status } } = error
  const originalRequest = config

  if (status === 401) {
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true
      store.dispatch(fetchAccessToken()).then((access_token) => {
        isAlreadyFetchingAccessToken = false
        onAccessTokenFetched(access_token)
      })
    }

    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber(access_token => {
        originalRequest.headers.Authorization = 'Bearer ' + access_token
        resolve(axios(originalRequest))
      })
    })
    return retryOriginalRequest
  }
  return Promise.reject(error)
})

export default instance
