import KeycloakService from '~/public/keycloak/keycloak'
import { isSignoutRoute } from '~/util/misc-helpers'
/**
 * This middleware function is called before the default layout is rendered.
 * It initializes Keycloak and syncs the session (eg, logged in/out).
 * NB: This does not run correctly as a plugin.
 */
export default async function () {
  console.log('Starting Keycloak service...')

  const keycloakConfig: any = {
    url: 'https://dev.loginproxy.gov.bc.ca/auth',
    realm: "bcregistry",
    clientId: "NameX-Dev"
  }

  await KeycloakService.setKeycloakConfigUrl(keycloakConfig)

  // Auto-authenticate user unless they are trying to log out.
  if (!isSignoutRoute(window.location.pathname)) {
    // Initialize token service which will do a check-sso to initiate session.
    await KeycloakService.initializeToken(null)
      .catch(err => {
        if (err?.message !== 'NOT_AUTHENTICATED') {
          throw err
        }
      })
  }
}