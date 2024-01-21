import { signOut, OAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth'
import { useUserStore } from '~/store/user-cache'

/**
 * perform user log out
 */
export async function logout () {
  const { $auth } = useNuxtApp()
  signOut($auth)
  const userStore = useUserStore()
  await userStore.setUser()
  // reloadNuxtApp()
}

/**
 * perform user log in
 */
export async function login () {
  // TODO use env var for provider
  const provider = new OAuthProvider('oidc.namex')
  const { $auth } = useNuxtApp()
  signInWithRedirect($auth, provider)
  // const userStore = useUserStore()
  // await userStore.setUser()
}

/**
 * check login token
 */
export async function examine () {
  const { $auth } = useNuxtApp()
  const userCredential = await getRedirectResult($auth)
  if (userCredential) {
    const credentials = OAuthProvider.credentialFromResult(userCredential)
    console.log(credentials)
    console.log(userCredential)
  }
}
