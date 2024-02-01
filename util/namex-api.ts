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
  
/**
 * Make a GET request to the given NameX API URL and return the response json.
 * @param url the url to fetch
 * @returns the json response object
 */
export async function getNamexObject(url: URL): Promise<any> {
  return (await callNamexApi(url)).json()
}

/**
 * Get a name request object given its NR number.
 */
export async function getNameRequest(nrNumber: string) {
  return callNamexApi(getNamexApiUrl(`/requests/${nrNumber}`))
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

export async function getBusiness(corpNum: string) {
  return callNamexApi(getNamexApiUrl(`/businesses/${corpNum}`))
}

export async function getCorporation(corpNum: string) {
  return callNamexApi(getNamexApiUrl(`/corporations/${corpNum}`))
}
