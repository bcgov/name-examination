import type { NameChoice, NameRequest, Transactions } from '~/types'

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
 * @param options extra options to pass to the `fetch` call, should not include headers
 * @param headers header options to pass to the request
 */
async function callNamexApi(url: URL, options?: object, headers?: object) {
  const token = await getToken()
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
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
  return callNamexApi(
    url,
    {
      method: 'PATCH',
      body: JSON.stringify(patch),
    },
    { 'content-type': 'application/json' }
  )
}

export async function postNewComment(nrNumber: string, comment: string) {
  const url = getNamexApiUrl(`/requests/${nrNumber}/comments`)
  return callNamexApi(
    url,
    {
      method: 'POST',
      body: JSON.stringify({ comment }),
    },
    { 'content-type': 'application/json' }
  )
}

/** Update a name request's data with the given name request object. */
export async function putNameRequest(nrNumber: string, nrObject: NameRequest) {
  const url = getNamexApiUrl(`/requests/${nrNumber}`)
  return callNamexApi(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(nrObject),
    },
    { 'content-type': 'application/json' }
  )
}

export async function putNameChoice(nrNumber: string, choice: NameChoice) {
  const url = getNamexApiUrl(`/requests/${nrNumber}/names/${choice.choice}`)
  return callNamexApi(
    url,
    {
      method: 'PUT',
      body: JSON.stringify(choice),
    },
    { 'content-type': 'application/json' }
  )
}

export async function getTransactions(nrNumber: string): Promise<Transactions> {
  return getNamexObject(getNamexApiUrl(`/events/${nrNumber}`))
}

export async function getBusiness(corpNum: string) {
  return callNamexApi(getNamexApiUrl(`/businesses/${corpNum}`))
}

async function postDocuments(resource: string, query: string) {
  const url = getNamexApiUrl(`/documents:${resource}`)
  return callNamexApi(
    url,
    {
      method: 'POST',
      body: JSON.stringify({ type: 'plain_text', content: query }),
    },
    { 'content-type': 'application/json' }
  )
}

export async function postTrademarks(query: string) {
  return postDocuments('trademarks', query)
}

export async function postConditions(query: string) {
  return postDocuments('restricted_words', query)
}

export async function postHistories(query: string) {
  return postDocuments('histories', query)
}

export async function getDecisionReasons() {
  return callNamexApi(getNamexApiUrl(`/requests/decisionreasons`))
}

export async function getExactMatches(query: string) {
  const url = getNamexApiUrl('/exact-match')
  url.searchParams.set('query', query)
  return callNamexApi(url)
}

export async function getSynonymMatches(query: string, exactPhrase: string) {
  const url = getNamexApiUrl(`/requests/synonymbucket/${query}/${exactPhrase}`)
  return callNamexApi(url)
}

export async function getCobrsPhoneticMatches(query: string) {
  const url = getNamexApiUrl(`/requests/cobrsphonetics/${query}/*`)
  return callNamexApi(url)
}

export async function getPhoneticMatches(query: string) {
  const url = getNamexApiUrl(`/requests/phonetics/${query}/*`)
  return callNamexApi(url)
}

export async function getNextNrNumber(isPriority: boolean) {
  return callNamexApi(
    getNamexApiUrl(`/requests/queues/@me/oldest?priorityQueue=${isPriority}`)
  )
}

export async function getCorporation(corpNum: string) {
  return callNamexApi(getNamexApiUrl(`/corporations/${corpNum}`))
}

export async function getPayments(id: number) {
  return callNamexApi(getNamexApiUrl(`/payments/${id}`))
}

export async function getStats(params: string) {
  return callNamexApi(getNamexApiUrl('/requests/stats' + params))
}
