import { Routes } from '~/enums/routes'

const LOGOUT_URL = 'LOGOUT_URL'
const LOGIN_URL = 'LOGIN_URL'
const SITEMINDER_LOGOUT_URL = 'SITEMINDER_LOGOUT_URL'
const REGISTRY_HOME_URL = 'REGISTRY_HOME_URL'


/** Returns true if current route is Signin. */
export function isSigninRoute (path = window.location.pathname): boolean {
  return path.startsWith(Routes.SIGNIN)
}

/** Returns true if current route is Signout. */
export function isSignoutRoute (path = window.location.pathname): boolean {
  return path.startsWith(Routes.SIGNOUT)
}

/** Returns true if current route is Login. */
export function isLoginRoute (path = window.location.pathname): boolean {
  return path.startsWith(Routes.LOGIN)
}

/** "Sleeps" for specified timeout. Must be awaited. */
 export function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** Sets URL to return to when user logs out. */
export function setLogoutUrl (url: string): void {
  sessionStorage.setItem(LOGOUT_URL, url)
}

/** Gets URL to return to when user logs out. */
export function getLogoutUrl (): string | null{
  return sessionStorage.getItem(LOGOUT_URL)
}

/** Sets URL to return to when user logs in. */
export function setLoginUrl (url: string): void {
  sessionStorage.setItem(LOGIN_URL, url)
}

/** Gets URL to return to when user logs in. */
export function getLoginUrl (): string | null{
  return sessionStorage.getItem(LOGIN_URL)
}

/** Sets site mionder URL to clear cookie. */
export function setSiteMinderLogoutUrl (url: string): void {
  if(url?.includes('http')) {
    sessionStorage.setItem(SITEMINDER_LOGOUT_URL, url)
  }  
}

/** Gets URL for sbc-common component to identify home URL. */
export function setRegistyHomeUrl (url: string): void {
  sessionStorage.setItem(REGISTRY_HOME_URL, url)
}