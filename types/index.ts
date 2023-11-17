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
  comments: Comment[]
}

export interface CorpConflict extends Conflict {
  'incorp #': string
  directors: string[]
  'nature of business': string
}

export interface BCCorpConflict extends CorpConflict {
  'records office delivery address': string[]
  'registered office delivery address': string[]
}

export interface XproConflict extends CorpConflict {
  'attorney names': string[]
  'head office': string
}
