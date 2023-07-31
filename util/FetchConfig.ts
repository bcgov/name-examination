/* eslint-disable require-jsdoc */
export default async function fetchConfig (): Promise<any> {
  // get config from environment
  const origin: string = window.location.origin
  const windowLocationPathname: string = window.location.pathname // eg, /basePath/...
  const windowLocationOrigin: string = window.location.origin // eg, http://localhost:8080
  // const windowLocationSearch: string = window.location.search

  if (!origin || !windowLocationPathname || !windowLocationOrigin) {
    return Promise.reject(new Error('Missing environment variables'))
  }

  const keycloakAuthUrl: string = process.env.VUE_APP_KEYCLOAK_AUTH_URL || 'default-url';
  (<any>window).keycloakAuthUrl = keycloakAuthUrl

  const keycloakRealm: string = process.env.VUE_APP_KEYCLOAK_REALM || 'default-realm';
  (<any>window).keycloakRealm = keycloakRealm

  const keycloakClientId: string = process.env.VUE_APP_KEYCLOAK_CLIENTID || 'default-id';
  (<any>window).keycloakClientId = keycloakClientId
}
