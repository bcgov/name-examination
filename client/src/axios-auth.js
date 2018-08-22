/* eslint-disable */
import axios from 'axios'
import store from '@/store'

const instance = axios.create({
})

var activeRequestsCounter = 0;

instance.interceptors.request.use(function (config) {
  /*
  1. Increase the counter of how many active requests there are in progress.
  2. Create a timer to show the spinner after 1 second; the delay is so we don't flash in up for
      very fast requests.
  3. Save the timer to this request so it can be passed to the response/error handling and
      cancelled. Otherwise we get orphaned timers that do not get cancelled when the response is
      returned, and the loading spinner never goes away.
   */
  activeRequestsCounter++;
  var loadingTimer = setTimeout(function () {
    $('#loading-overlay').css('display', 'flex');
  }, 1000);
  config.loadingTimer = loadingTimer;

  store.dispatch('checkToken');

  return config;
});

instance.interceptors.response.use(function (response) {
  /*
  1. Cancel the timer associated with this request.
  2. Decrease the list of requests running timers.
  3. If there are no more requests that might still be running, hide the overlay.
   */
  clearTimeout(response.config.loadingTimer);
  activeRequestsCounter--;
  if (activeRequestsCounter <= 0) {
    activeRequestsCounter = 0;
    $('#loading-overlay').css('display', 'none');
  }

  store.dispatch('checkToken');

  let status = response.status;
  if ( status !== 200 ) {
      store.dispatch('checkError',response.data)
  }

  return response

}, function (error) {
  /*
  1. cancel the timer associated with this request
  2. decrease the list of requests running timers
  3. if there are no more requests that might still be running, hide the overlay
   */
  clearTimeout(error.config.loadingTimer);
  activeRequestsCounter--;
  if (activeRequestsCounter <= 0) {
    activeRequestsCounter = 0;
    $('#loading-overlay').css('display', 'none');
  }

  /* This code was never executed before implementing above, so commented out since untested.
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
  */
  store.dispatch('checkError',error)
  return Promise.reject(error)
})

export default instance
