/*eslint-disable*/
import moment from 'moment'

export function isNotBlankSpace(value) {
  if (value)
    return value.replace(/\s/g,'')!='';
  return false;
}

/* validation function for date format - validates for DD-MM-YYYY */
export function isActualDate(value) {
  return moment(value).isValid()
}
export function isValidFormat(value) {
  if (value.length === 10 && value.charAt(4) === '-' && value.charAt(7) === '-') return true
  return false
}

/* validation function for date - is it in the future? */
export function isFutureDate(value) {
  let today = new moment()
  return moment(value, 'YYYY-MM-DD').isAfter(today)
}
