import { initializeApp } from 'firebase/app'
import { getRemoteConfig, fetchAndActivate } from 'firebase/remote-config'
import { getAnalytics } from 'firebase/analytics'
import { FeatureFlags } from '@/util/constants'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    appId: config.public.firebaseAppId
  }

  const app = initializeApp(firebaseConfig)

  const analytics = getAnalytics(app)
  const remoteConfig = getRemoteConfig(app)

  remoteConfig.settings.fetchTimeoutMillis = 10
  remoteConfig.settings.minimumFetchIntervalMillis = 10

  remoteConfig.defaultConfig = {
    [FeatureFlags.NAMEX_BANNER]: 'rajan'
  }

  await fetchAndActivate(remoteConfig)

  nuxtApp.vueApp.provide('analytics', analytics)
  nuxtApp.provide('analytics', analytics)

  nuxtApp.vueApp.provide('remoteConfig', remoteConfig)
  nuxtApp.provide('remoteConfig', remoteConfig)

  console.info(remoteConfig)
})
