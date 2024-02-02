import type { NameChoice } from '~/types'
import { getBusiness, getCorporation, getNameRequest } from './namex-api'
import { Status } from '~/enums/nr-status'

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

/** Get a default empty `NameChoice` object. */
export function getEmptyNameChoice(
  choiceIndex: number,
  nameString = ''
): NameChoice {
  return {
    choice: choiceIndex,
    name: nameString,
    state: Status.NotExamined,
    decision_text: null,
    conflict1: null,
    conflict2: null,
    conflict3: null,
    consumptionDate: null,
    corpNum: null,
    conflict1_num: null,
    conflict2_num: null,
    conflict3_num: null,
    comment: null,
  }
}

/** Sanitize the given query string to remove special characters. */
export function sanitizeQuery(query: string, exactMatch = false) {
  const baseSanitized = query
    .replace(/(^| )(\$+(\s|$)+)+/g, '$1DOLLAR$3')
    .replace(/(^| )(¢+(\s|$)+)+/g, '$1CENT$3')
    .replace(/\$/g, 'S')
    .replace(/¢/g, 'C')
    .replace(/[\\\/]/g, ' ')
    .replace(/(`|~|!|\||\(|\)|\[|\]|\{|\}|:|"|\^|#|%|\?)/g, '')
  if (exactMatch) {
    return baseSanitized
      .replace(' /', '/')
      .replace(/[\+\-]{2,}/g, '')
      .replace(/\s[\+\-]$/, '')
  } else {
    return baseSanitized.replace(/[&+\-]/, ' ').replace(/,/g, '')
  }
}
