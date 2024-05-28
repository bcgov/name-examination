/** Utils related to creating formatted display strings for data (excluding dates, see `~/util/date.ts`) */

import {
  ConsentFlag,
  EntityTypeCode,
  RequestActionCode,
  RequestTypeCode,
} from '~/enums/codes'
import { Status } from '~/enums/nr-status'
import type { NameChoice } from '~/types'
import { toMappedRequestType } from './request-type'
import requestTypes from '~/data/request_types.json'

export function getStatusDisplay(
  status: Status | null,
  names: Array<NameChoice>
) {
  if (!status) return 'N/A'

  let displayState = status as string
  if (status === Status.Conditional) {
    displayState = 'CONDITIONAL APPROVED'
  } else if (status === Status.Consumed && names && names.length > 0) {
    const approvedName = names.find((name) =>
      [Status.Approved, Status.Condition].includes(name.state)
    )
    displayState =
      approvedName?.state === Status.Condition
        ? 'CONDITIONAL APPROVED'
        : 'APPROVED'
    displayState += ` / Used for ${approvedName?.corpNum}`
  }
  return displayState
}

export function getConsentDisplay(
  date: string | null,
  consentFlag: ConsentFlag
) {
  return date
    ? 'Required. Received.'
    : consentFlag === ConsentFlag.Required
    ? 'Required. Not yet received.'
    : 'Not required'
}

/** Get a display string based on fields from an NR object.
 * Returns 'N/A' if the request type could not be found.
 */
export function getRequestTypeDisplay(
  requestType: RequestTypeCode,
  action: RequestActionCode,
  entityType: EntityTypeCode
) {
  const mapped = toMappedRequestType(requestType, action, entityType)
  return requestTypes.find((r) => r.value == mapped)?.text || 'N/A'
}
