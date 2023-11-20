import { DateTime } from 'luxon'

const TIMESTAMP_FORMAT = 'yyyy-MM-dd, hh:mm a'
const DATE_FORMAT = 'yyyy-MM-dd'

/**
 * @param input An ISO-formatted date string
 * @returns a formatted timestamp string
 */
export function getFormattedTimestampFromString(input: string): string {
  return DateTime.fromISO(input).toFormat(TIMESTAMP_FORMAT)
}

/**
 * @param input An ISO-formatted date string
 * @returns a formatted date string
 */
export function getFormattedDateFromString(input: string): string {
  return DateTime.fromISO(input).toFormat(DATE_FORMAT)
}

/**
 *
 * @param input A luxon `DateTime` object
 * @returns a formatted timestamp string
 */
export function getFormattedTimestampFromDateTime(input: DateTime) {
  return input.toFormat(TIMESTAMP_FORMAT)
}
