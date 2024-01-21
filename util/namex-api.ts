import { useUserStore } from '~/store/user-cache'

/**
 * Returns the full NameX API url given an endpoint
 * @param endpoint The API endpoint (including the starting slash '/')
 */
export function getNamexApiUrl (endpoint: string): URL {
  const config = useRuntimeConfig().public
  return new URL(
    config.namexAPIVersion + endpoint,
    config.namexAPIURL as string
  )
}

/**
 * Make a call to the NameX API and return the response json
 * @param url The url to fetch
 * @return The json response object
 */
export async function callNamexApi (url: URL): Promise<any> {
  const userStore = useUserStore()
  let response: Response = new Response()
  const token = userStore.token

  if (token.length > 0) {
    const token = userStore.token

    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  return response?.json()
}
