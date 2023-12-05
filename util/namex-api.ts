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
  const response = await $auth
    .updateToken(30)
    .then(async (_refreshed) => {
      return await fetch(url, {
        headers: {
          Authorization: `Bearer ${$auth.token}`,
        },
      })
    })
    .catch(async (error) => {
      console.error(`Failed to update Keycloak token: ${error}`)
      return await fetch(url)
    })

  return await response.json()
}
