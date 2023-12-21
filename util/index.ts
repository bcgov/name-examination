import {
  EntityTypeCode,
  RequestActionCode,
  RequestTypeCode,
} from '~/enums/codes'

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
