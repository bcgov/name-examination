import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { OAuthProvider, getRedirectResult, onAuthStateChanged } from 'firebase/auth'

export const useUserStore = defineStore('user-cache', () => {
  const authenticated = ref(false)
  const userName = ref('')
  const token = ref('')
  // eslint-disable-next-line require-jsdoc
  async function setUser () {
    const { $auth } = useNuxtApp()
    $auth.onAuthStateChanged(async function (user) {
      if (user) {
        userName.value = user.displayName ? user.displayName : ''
        authenticated.value = true
        const { $auth } = useNuxtApp()
        const userCredential = await getRedirectResult($auth)
        if (userCredential) {
          const credentials = OAuthProvider.credentialFromResult(userCredential)
          token.value = credentials?.accessToken ? credentials.accessToken : ''
        }
        // examine()
      } else {
        userName.value = ''
        authenticated.value = false
        token.value = ''
      }
    })
  }
  return { authenticated, userName, token, setUser }
}
// , { persist: true }
)
