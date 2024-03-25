import type { ConflictList, ConflictListItem } from '~/types'
import type { AppError } from '../types/errors'
import mitt from 'mitt'

export type EmitterEvents = {
  error: AppError
  recipeTabChanged: number
  scrollToRecipeObject: ConflictListItem | ConflictList
}

export const emitter = mitt<EmitterEvents>()
