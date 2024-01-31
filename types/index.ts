import type {
  ClassTypeCode,
  ConsentFlag,
  EntityTypeCode,
  RequestActionCode,
  RequestTypeCode,
} from '~/enums/codes'
import type { Status } from '~/enums/nr-status'

export interface Applicants {
  firstName: string
  lastName: string
  addrLine1: string
  addrLine2: string
  addrLine3: string
  city: string
  stateProvinceCd: string
  postalCd: string
  countryTypeCd: string
  phoneNumber: string
  emailAddress: string
  clientFirstName: string
  clientLastName: string
  contact: string
}

export interface NameChoice {
  choice: number
  name: string
  state: Status
  decision_text: string | null
  conflict1: string | null
  conflict2: string | null
  conflict3: string | null
  consumptionDate: string | null
  corpNum: string | null
  conflict1_num: string | null
  conflict2_num: string | null
  conflict3_num: string | null
  comment: string | null
}

export interface Comment {
  comment: string
  examiner: string
  timestamp: string
}

export interface Conflict {
  type: 'corp' | 'name'
  startDate: string
  nrNumber: string
  jurisdiction: string
  text: string
  invalidRecordInd: boolean
}

export interface NameRequestConflict extends Conflict {
  applicants: Applicants
  state: string
  comments: Array<Comment>
  names: Array<NameChoice>
}

export interface CorpConflict extends Conflict {
  'incorp #': string
  directors: string[] | 'Not Available'
  'nature of business': string
}

export interface BCCorpConflict extends CorpConflict {
  'records office delivery address': string[] | 'Not Available'
  'registered office delivery address': string[]
}

export interface XproConflict extends CorpConflict {
  'attorney names': string[] | 'Not Available'
  'head office': string[]
}

export interface HistoryEntry {
  name: string
  jurisdiction: string
  nr_num: string
  start_date: string
  name_state_type_cd: string
  score: number
  submit_count: number
}

export interface History {
  names: Array<HistoryEntry>
  highlighting: string
  response: {
    maxScore: number
    name: string
    numFound: number
    /** string representing number of rows */
    rows: string
    start: number
  }
}

export interface ConflictListItem {
  text: string
  highlightedText: string
  jurisdiction: string
  nrNumber: string
  startDate: string
  source: 'CORP' | 'NR'
}

export interface ConflictList {
  text: string
  highlightedText: string
  meta: string
  children: Array<ConflictListItem>
}

export interface ConditionsList {
  restricted_words_conditions: [
    {
      cnd_info: [
        {
          allow_use: 'Y' | 'N'
          consent_required: 'Y' | 'N'
          consenting_body: string | null
          id: number
          instructions: string
          text: string
        }
      ]
      word_info: {
        id: number
        phrase: string
      }
    }
  ]
}

export interface Condition {
  allow_use: 'Y' | 'N'
  consent_required: 'Y' | 'N'
  id: number
  instructions: string
  text: string
  consent_required_tf: boolean
  allow_use_tf: boolean
  phrase: string
}

export interface Macro {
  id: number
  name: string
  reason: string
}

export interface Trademark {
  application_number: string
  description: string
  name: string
  score: number
  status: string
}

export interface TrademarkApiResponse {
  names: Array<Trademark>
}

export interface RequestType {
  value: RequestTypeCode
  text: string
  short_desc: string
  class_type_cd: ClassTypeCode
  legacy_cd: string
  additional_info: string
  source_application: 'COLIN' | ''
  entity_type_cd: EntityTypeCode
  request_action_cd: RequestActionCode
}

export interface RequestTypeRule {
  request_type: string
  jurisdiction_required: boolean
  prev_nr_required: boolean
  corp_num_required: boolean
  additional_info_template: string
  is_lp_nwpta_type: boolean
  is_cp_nwpta_type: boolean
}

export interface Jurisdiction {
  /** two letter code */
  value: string
  short_desc: string
  text: string
}

export interface Transaction {
  additionalInfo: string
  consentFlag: 'Y' | 'N'
  /** consent date */
  consent_dt: string | null
  corpNum: string | null
  eventDate: string
  expirationDate: string | null
  furnished: 'Y' | 'N'
  names: Array<NameChoice>
  priorityCd: 'Y' | 'N'
  requestTypeCd: RequestTypeCode
  request_action_cd: RequestActionCode
  stateCd: Status
  user_action: string
  user_name: string
}

export interface Action {
  URL: string
  entitiesFilingName: string
  filingName: string
  learTemplate?: string
}

export interface Applicant {
  addrLine1: string
  addrLine2: string
  addrLine3: string
  city: string
  clientFirstName: string
  clientLastName: string
  contact: string
  countryTypeCd: string
  declineNotificationInd: any
  emailAddress: string
  faxNumber: string
  firstName: string
  lastName: string
  middleName: string
  partyId: number
  phoneNumber: string
  postalCd: string
  stateProvinceCd: string
}

export interface NameRequest {
  actions: Array<Action>
  additionalInfo: string
  applicants: Applicant
  checkedOutBy: string | null
  checkedOutDt: string | null
  comments: Array<Comment>
  consentFlag: ConsentFlag | null
  consent_dt: string | null
  corpNum: string | null
  entity_type_cd: EntityTypeCode
  expirationDate: string | null
  furnished: 'Y' | 'N'
  hasBeenReset: boolean
  homeJurisNum: string | null
  id: number
  lastUpdate: string
  legalType: string
  names: Array<NameChoice>
  natureBusinessInfo: string | null
  notifiedBeforeExpiry: boolean
  notifiedExpiry: boolean
  nrNum: string
  previousNr: string | null
  previousRequestId: string | null
  previousStateCd: Status | null
  priorityCd: 'Y' | 'N'
  priorityDate: string
  requestTypeCd: RequestTypeCode
  request_action_cd: RequestActionCode
  source: string | null
  state: Status
  stateCd: string
  submitCount: number
  submittedDate: string
  submitter_userid: string
  target: string
  tradeMark: string | null
  userId: string
  xproJurisdiction: string
}
