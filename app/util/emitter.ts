import type { ConflictListItem } from '~/types'
import type { AppError } from '../types/errors'
import mitt from 'mitt'

export type EmitterEvents = {
  error: AppError
  recipeTabChanged: number
  scrollToConflictObject: {obj: ConflictListItem, instant: boolean}
}

export const emitter = mitt<EmitterEvents>()
