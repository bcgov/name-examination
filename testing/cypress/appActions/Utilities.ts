/**
 * Handy utilities for the app
 */
import MD5 from 'crypto-js/md5'

class Utilities {
  runOk(data: any): boolean {
    const isLocalTest = Cypress.env('localtest')
    const isSmokeTest = Cypress.env('smoketest')

    // Directly return the evaluation based on conditions
    if (!isLocalTest && !isSmokeTest) {
      // If neither localtest nor smoketest is set, always return true
      return true
    } else if (isLocalTest && isSmokeTest) {
      // If both flags are set, check corresponding data properties
      return data.localtest && data.smoketest
    } else if (isLocalTest) {
      // If only localtest is set, check the localtest data property
      return data.localtest
    } else if (isSmokeTest) {
      // If only smoketest is set, check the smoketest data property
      return data.smoketest
    }

    // Default return should never be reached due to logic above covering all cases,
    // but it's good practice to have a fallback return in case the function logic evolves.
    return false
  }
  md5(data: string): string {
    return MD5(data).toString()
  }
  getDate(): string {
    let today = new Date()
    let dd: any = today.getDate()
    let mm: any = today.getMonth() + 1 //January is 0!
    let yyyy = today.getFullYear()
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    return yyyy + mm + dd
  }
  getRandomInt(min: number, max: number): number {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
  }

  /**
   * Retrieves the key from a given object map based on the provided search value.
   * @param map - The object map to search in.
   * @param searchValue - The value to search for.
   * @returns The key associated with the search value, or undefined if the value is not found.
   */
  getKeyByValue(
    map: { [key: string]: string },
    searchValue: string
  ): string | undefined {
    for (const [key, value] of Object.entries(map)) {
      if (value === searchValue) {
        return key
      }
    }
    return undefined // or return a default value or handle the case when the value is not found
  }
}
export default Utilities
