import { DateTime } from 'luxon'

const DATE_FORMAT = 'yyyy-MM-dd, hh:mm a'

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
 * @returns a formatted date string
 */
export function getFormattedDateFromDateTime(input: DateTime) {
  return input.toFormat(DATE_FORMAT)
}
