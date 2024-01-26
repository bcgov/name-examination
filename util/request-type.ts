import {
  RequestTypeCode,
  RequestActionCode,
  EntityTypeCode,
} from '~/enums/codes'

type RequestTypeMap = { [key in RequestTypeCode]?: RequestTypeCode }

export const NORMAL_TO_AMALGAMATED_MAP: RequestTypeMap = {
  [RequestTypeCode.CR]: RequestTypeCode.ACR,
  [RequestTypeCode.XCR]: RequestTypeCode.XACR,
  [RequestTypeCode.CP]: RequestTypeCode.ACP,
  [RequestTypeCode.CC]: RequestTypeCode.ACC,
}
export const AMALGAMATED_TO_NORMAL_MAP = Object.fromEntries(
  Object.entries(NORMAL_TO_AMALGAMATED_MAP).map((e) => e.reverse())
)

export const SOLE_PROP_TO_GP_MAP: RequestTypeMap = {
  [RequestTypeCode.FR]: RequestTypeCode.GP,
  [RequestTypeCode.CFR]: RequestTypeCode.CGP,
}
export const GP_TO_SOLE_PROP_MAP = Object.fromEntries(
  Object.entries(NORMAL_TO_AMALGAMATED_MAP).map((e) => e.reverse())
)

export function toMappedRequestType(
  requestType: RequestTypeCode,
  action: RequestActionCode,
  entityType: EntityTypeCode
) {
  // Map amalgamation split requests
  if (action === RequestActionCode.AML) {
    const newType = NORMAL_TO_AMALGAMATED_MAP[requestType]
    if (newType) return newType
  }
  // Map sole general partnership split requests
  if (entityType === EntityTypeCode.GP) {
    const newType = SOLE_PROP_TO_GP_MAP[requestType]
    if (newType) return newType
  }
  return requestType
}

export function fromMappedRequestType(
  requestType: RequestTypeCode,
  action: RequestActionCode
) {
  // Map amalgamation split requests
  if (action === RequestActionCode.AML) {
    const newType = NORMAL_TO_AMALGAMATED_MAP[requestType]
    if (newType) {
      console.log('hit2')
      return newType
    }
  }
  // Map sole general partnership split requests
  const newType = SOLE_PROP_TO_GP_MAP[requestType]
  if (newType) return newType
  return requestType
}
