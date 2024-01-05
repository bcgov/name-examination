import type { Transaction } from '~/types'

/**
 * Retrieve the Keycloak session token, refreshing to make it valid if necessary.
 * @returns the session token
 */
async function getToken(): Promise<string | undefined> {
  const { $auth } = useNuxtApp()
  return await $auth
    .updateToken(30)
    .then((_refreshed) => {
      return $auth.token
    })
    .catch(async (error) => {
      console.error(`Failed to get session token: ${error}`)
      return undefined
    })
}

/**
 * Make an HTTP request to a given Namex API URL.
 */
async function callNamexApi(url: URL, options?: object) {
  const token = await getToken()
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(options ? options : {}),
  })
}

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
 * Make a GET request to the given NameX API URL and return the response json.
 * @param url the url to fetch
 * @returns the json response object
 */
export async function getNamexObject(url: URL): Promise<any> {
  return (await callNamexApi(url)).json()
}

/**
 * Get a name request given its NR number.
 */
export async function getNameRequest(nrNumber: string) {
  return getNamexObject(getNamexApiUrl(`/requests/${nrNumber}`))
}

/**
 * Patch the name request with the given NR number with a patch object.
 */
export async function patchNameRequest(nrNumber: string, patch: object) {
  const url = getNamexApiUrl(`/requests/${nrNumber}`)
  return await callNamexApi(url, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

export async function getTransactions(
  nrNumber: string
): Promise<Array<Transaction>> {
  return getNamexObject(getNamexApiUrl(`/events/${nrNumber}`))
}

export async function getBusinesses(corpNum: string) {
  return callNamexApi(getNamexApiUrl(`/businesses/${corpNum}`))
}

export async function getCorporations(corpNum: string) {
  return callNamexApi(getNamexApiUrl(`/corporations/${corpNum}`))
}
