import type { ConflictList, ConflictListItem } from '~/types'
import type { AppError } from '../types/errors'
import mitt from 'mitt'

export type EmitterEvents = {
  error: AppError
  expandRecipeObject: ConflictListItem | ConflictList
  collapseRecipeObject: ConflictListItem | ConflictList
  collapseAllConflictLists: undefined
}

export const emitter = mitt<EmitterEvents>()
