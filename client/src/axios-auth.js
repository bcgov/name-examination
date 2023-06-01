/* eslint-disable */
import axios from 'axios'
import store from '@/store'

const instance = axios.create()

instance.defaults.headers.get['Accept'] = 'application/json'
instance.defaults.headers.put['Content-Type'] = 'application/json'

var activeRequestsCounter = 0

instance.interceptors.request.use(function (config) {
  /*
  1. Increase the counter of how many active requests there are in progress.
  2. Create a timer to show the spinner after 1 second; the delay is so we don't flash in up for
      very fast requests.
  3. Save the timer to this request so it can be passed to the response/error handling and
      cancelled. Otherwise we get orphaned timers that do not get cancelled when the response is
      returned, and the loading spinner never goes away.
   */
  if (config.spinner == false) {
    config.loadingTimer = null // just null the timer value for use in response interceptor
  }
  // activate specific named spinner - commonly used in recipe steps - not timed, just turned on and off
  else if (typeof ( config.spinner ) == 'string') {
    $(config.spinner).removeClass('hidden')
  }
  // activate main (page-blocking) spinner
  else {
    activeRequestsCounter++
    var loadingTimer = setTimeout(function () {
      $('#loading-overlay').css('display', 'flex')
    }, 1000)
    config.loadingTimer = loadingTimer
  }

  store.dispatch('checkToken')

  return config
})

instance.interceptors.response.use(function (response) {
  /*
  1. Cancel the timer associated with this request.
  2. Decrease the list of requests running timers.
  3. If there are no more requests that might still be running, hide the overlay.
   */
  if (response.config.loadingTimer !== null) {

    clearTimeout(response.config.loadingTimer)
    activeRequestsCounter--
    if (activeRequestsCounter <= 0) {
      activeRequestsCounter = 0
      $('#loading-overlay').css('display', 'none')
    }
  }

  // turn off named spinner
  if (typeof ( response.config.spinner ) == 'string') {
    $(response.config.spinner).addClass('hidden')
  }

  store.dispatch('checkToken')

  let status = response.status
  if (status !== 200) {
    store.dispatch('checkError', response.data)
  }

  return response

}, function (error) {
  /*
  1. cancel the timer associated with this request
  2. decrease the list of requests running timers
  3. if there are no more requests that might still be running, hide the overlay
   */
  if (error.config.loadingTimer !== null) {
    clearTimeout(error.config.loadingTimer)
    activeRequestsCounter--
    if (activeRequestsCounter <= 0) {
      activeRequestsCounter = 0
      $('#loading-overlay').css('display', 'none')
    }
  }

  // turn off named spinner
  if (error.config.spinner && typeof ( error.config.spinner ) == 'string') {
    $(error.config.spinner).addClass('hidden')
  }

  if (
    error.request && error.request.responseURL && 
    (
      error.request.responseURL.includes('/api/v1/events/') ||
      (error.request.responseURL.includes('api/v1/corporations') && 
      error.response.data.message === "Error: Could not find corporation details") ||
      (error.request.responseURL.includes('api/v1/businesses') &&
      error.response.status === 404)
    )
  ) {
    return Promise.reject(error)
  }

  store.dispatch('checkError', error)
  return Promise.reject(error)
})

export default instance
