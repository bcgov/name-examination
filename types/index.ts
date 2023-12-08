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
  name: string
  conflict1: string
  conflict2: string
  conflict3: string
  decision_text: string
  state: string
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
}

export interface History {
  names: Array<HistoryEntry>
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