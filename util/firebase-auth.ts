import { signOut, OAuthProvider, signInWithRedirect } from 'firebase/auth'

/**
 * perform user log out
 */
export async function logout () {
  const { $auth } = useNuxtApp()
  signOut($auth)
  window.location.assign('/')
}

/**
 * perform user log in
 */
export async function login () {
  const config = useRuntimeConfig().public
  const provider = new OAuthProvider(config.gcpIDP)
  const { $auth } = useNuxtApp()
  signInWithRedirect($auth, provider)
}
