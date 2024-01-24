import type { AppError } from '../types/errors'
import mitt from 'mitt'

export type EmitterEvents = {
  error: AppError
}

export const emitter = mitt<EmitterEvents>()
