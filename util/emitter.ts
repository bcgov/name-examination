import type { ConflictList, ConflictListItem } from '~/types'
import type { AppError } from '../types/errors'
import mitt from 'mitt'

export type EmitterEvents = {
  error: AppError
  expandRecipeObject: ConflictListItem | ConflictList
  collapseRecipeObject: ConflictListItem | ConflictList
  collapseAllConflictLists: undefined
  recipeTabChanged: number
  scrollToRecipeObject: ConflictListItem | ConflictList
}

export const emitter = mitt<EmitterEvents>()
