import type { ConflictSource } from '.'

export interface ConflictMatchCategory {
  highlighting: Array<unknown>
  names: Array<ConflictName>
  response: {
    maxScore: number
    name: string
    numFound: number
  }
}

export interface ConflictName {
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
