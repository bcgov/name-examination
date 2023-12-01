/**
 * Returns the full NameX API url given an endpoint
 * @param endpoint The API endpoint (including the starting slash '/')
 */
export function getNamexApiUrl(endpoint: string): URL {
  const config = useRuntimeConfig().public
  return new URL(
    config.namexAPIVersion + endpoint,
    config.namexAPIURL as string
  )
}

/**
 * Make a call to the NameX API and return the response json
 * @param url The url to fetch
 * @returns The json response object
 */
export async function callNamexApi(url: URL): Promise<any> {
  const { $auth } = useNuxtApp()
  const refreshed = await $auth.updateToken(30)
  if (refreshed) {
    console.log('[Keycloak] Refreshed token')
  }
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${$auth.token}`,
    },
  })
  return await response.json()
}
