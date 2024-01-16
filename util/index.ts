import {
  EntityTypeCode,
  RequestActionCode,
  RequestTypeCode,
} from '~/enums/codes'
import type { NameChoice } from '~/types'
import { getBusinesses, getCorporation, getNameRequest } from './namex-api'

export function getMappedRequestType(
  requestType: RequestTypeCode,
  action: RequestActionCode,
  entityType: EntityTypeCode
) {
  // Map amalgamation split requests
  if (action === RequestActionCode.AML) {
    switch (requestType) {
      case RequestTypeCode.CR:
        return RequestTypeCode.ACR
      case RequestTypeCode.XCR:
        return RequestTypeCode.XACR
      case RequestTypeCode.CP:
        return RequestTypeCode.ACP
      case RequestTypeCode.CC:
        return RequestTypeCode.ACC
    }
  }

  // Map sole general partnership split requests
  if (entityType === EntityTypeCode.GP) {
    switch (requestType) {
      case RequestTypeCode.FR:
        return RequestTypeCode.GP
      case RequestTypeCode.CFR:
        return RequestTypeCode.CGP
    }
  }
  return requestType
}

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
    await getNameRequest(nrNumber)
    return true
  } catch (e) {
    return false
  }
}

/** Return whether a given corp number is valid or not. */
export async function isValidCorpNum(input: string) {
  // valid corp numbers are between 7 and 10 characters long
  if (input.length < 7 || input.length > 10) {
    return false
  }

  // query entities for the corp num. if not found, query again from colin
  try {
    const businessResponse = await getBusinesses(input)
    if (businessResponse.status === 200) return true

    // ignore corp num prefix 'BC' if applicable to match colin BC corpNum format for the validation
    const corpNum = input.replace(/^BC+/i, '')
    const response = await (await getCorporation(corpNum)).json()
    return !(
      response.incorporated === 'Not Available' &&
      response.directors === 'Not Available'
    )
  } catch (error) {
    console.error(`Error while checking corp num: ${error}`)
    return false
  }
}

export function sortNameChoices(choices: Array<NameChoice>) {
  choices.sort((n1, n2) => n1.choice - n2.choice)
}
