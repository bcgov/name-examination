import type { ConflictSource } from '.'

export interface ConflictBucket {
  highlighting: Array<unknown>
  names: Array<ConflictBucketItem>
  response: {
    maxScore: number
    name: string
    numFound: number
  }
}

export interface ConflictBucketItem {
  name_info: {
    name: string
    id?: string
    jurisdiction?: string
    score?: number
    source?: ConflictSource
    start_date?: string
  }
  stems: Array<string>
}

export interface ExactMatches {
  names: Array<ExactMatchName>
}

export interface ExactMatchName {
  id: string
  jurisdiction: string
  name: string
  source: ConflictSource
  start_date: string
}
