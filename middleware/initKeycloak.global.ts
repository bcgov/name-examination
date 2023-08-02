import KeycloakService from '~/public/keycloak/keycloak'
import { isSigningIn } from '../util/utilities'
import ConfigHelper from '../util/config-helper'
import { SessionStorageKeys } from '../util/constants'
import { useAuthStore } from '../store/auth'
/**
 * This middleware function is called before the default layout is rendered.
 * It initializes Keycloak and syncs the session (eg, logged in/out).
 * NB: This does not run correctly as a plugin.
 */
export default async function () {
  const authModule = useAuthStore()
  console.log('Starting Keycloak service...')

  const keycloakConfig: any = {
    url: import.meta.env.VITE_APP_KEYCLOAK_AUTH_URL,
    realm: import.meta.env.VITE_APP_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_APP_KEYCLOAK_CLIENTID
  }

  await KeycloakService.setKeycloakConfigUrl(keycloakConfig)

  // Auto authenticate user once they are redirected from BC regisrty login page after enter credentials
  if (isSigningIn()) {
    // Initialize token service which will do a check-sso to initiate session
    await KeycloakService.initializeToken(authModule,
      true,
      !authModule.isAuthenticated).then(() => {
      const token = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken)
      if (!token) {
        // when there is no token in session storage, e.g. because token has expired due to user inactivity,
        // make sure to clear out account info saved on previous login
        ConfigHelper.removeFromSession(SessionStorageKeys.CurrentAccount)
      }
    }).catch((err) => {
      if (err?.message !== 'NOT_AUTHENTICATED') {
        throw err
      }
    })
    await KeycloakService.initSession()
  }
}
