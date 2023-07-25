import KeycloakService from '~/public/keycloak/keycloak'
/**
 * This middleware function is called before the default layout is rendered.
 * It initializes Keycloak and syncs the session (eg, logged in/out).
 * NB: This does not run correctly as a plugin.
 */
export default async function () {
  console.log('Starting Keycloak service...')

  const keycloakConfig: any = {
    url: import.meta.env.VITE_APP_KEYCLOAK_AUTH_URL,
    realm: import.meta.env.VITE_APP_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_APP_KEYCLOAK_CLIENTID
  }

  await KeycloakService.setKeycloakConfigUrl(keycloakConfig)
}
