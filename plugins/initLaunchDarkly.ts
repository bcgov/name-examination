import { initialize, LDClient, LDOptions } from 'launchdarkly-js-client-sdk'

// get rid of "element implicitly has an 'any' type..."
declare const window: any

/**
 * The Launch Darkly client instance.
 */
let ldClient: LDClient

/**
 * An async method that initializes the Launch Darkly client.
 */
export default async function initLdClient (): Promise<LDClient> {
  const envKey: string = window['ldClientId']

  if (envKey) {
    const user = {
      // since we have no user data yet, use a shared key temporarily
      key: 'anonymous'
    }
    const options: LDOptions = {
      // fetch flags using REPORT request (to see user data as JSON)
      useReport: true,
      // opt out of sending diagnostics data
      diagnosticOptOut: true,
      // open streaming connection for live flag updates
      streaming: true
    }

    ldClient = initialize(envKey, user, options)

    try {
      await ldClient.waitForInitialization()
    } catch (e) {
      // shut down client -- `variation()` will return undefined values
      await ldClient.close()
      // NB: LD logs its own errors
    }
  }

  return ldClient
}