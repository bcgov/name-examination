import type { NameChoice } from '~/types'
import { getBusiness, getCorporation, getNameRequest } from './namex-api'

/**
 * Return whether a given string is in a valid NR number format, i.e. NR xxxxxxx
 * @param input The NR number string to validate
 * @param allowNumbersOnly allow strings that are just a seven digit number, i.e. without the 'NR'
 */
export function isValidNrFormat(
  input: string,
  allowNumbersOnly: boolean = false
): boolean {
  const withLetters = /^NR \d{7}$/
  const numbersOnly = /^\d{7}$/
  return (
    withLetters.test(input) || (allowNumbersOnly && numbersOnly.test(input))
  )
}

export async function nrExists(nrNumber: string): Promise<boolean> {
  try {
    const response = await getNameRequest(nrNumber)
    return response.status === 200
  } catch (e) {
    return false
  }
}

/** Return whether the given input is in the correct format for a corp number.
 * @throws an error if the corp num check fails (e.g. the API request times out)
 *
 */
export function isValidCorpNumFormat(input: string) {
  // valid corp numbers are between 7 and 10 characters long
  return input.length >= 7 && input.length <= 10
}

/** Return whether the company with the given corp num exists. */
export async function corpExists(input: string) {
  // query entities for the corp num. if not found, query again from colin
  const businessResponse = await getBusiness(input)
  if (businessResponse.status === 200) return true

  // ignore corp num prefix 'BC' if applicable to match colin BC corp num format for the validation
  const corpNum = input.replace(/^BC+/i, '')
  const corporationResponse = await getCorporation(corpNum)
  if (corporationResponse.status === 200) {
    const responseJson = await corporationResponse.json()
    return !(
      responseJson.incorporated === 'Not Available' &&
      responseJson.directors === 'Not Available'
    )
  } else if (corporationResponse.status === 404) {
    return false
  } else {
    throw new Error('Failed to get corporation')
  }
}

export function sortNameChoices(choices: Array<NameChoice>) {
  choices.sort((n1, n2) => n1.choice - n2.choice)
}
