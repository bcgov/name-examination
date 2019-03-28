/*eslint-disable*/
export function isNotBlankSpace(value) {
  if (value)
    return value.replace(/\s/g,'')!='';
  return false;
}

/* validation function for date format - validates for DD-MM-YYYY */
export function isValidFormat(value) {

  // check for format DD-MM-YYYY
  if (value.match(/\d\d-\d\d-\d\d\d\d$/gi) == null) return false;

  // check that second numbers (month) aren't > 12, in which case user has probably
  // switched day and month
  if (value.substr(3, 2) > 12) {
    return false;
  }

  return true;
}

/* validation function for date format - does this string resolve to an actual Date object? */
export function isActualDate(value) {

  // try to convert string to Date object - if it's not an actual date (like Feb 31)
  // this will fail either by setting a date that's not actually the date (ie: it tries
  // to fix the data you gave it), or by returning "Invalid Date".
  var fakedate = new Date(value.substr(6, 4), (value.substr(3, 2) - 1), value.substr(0, 2));
  if (fakedate == "Invalid Date") return false;
  if (fakedate.getUTCDate() != value.substr(0, 2) * 1) return false;

  return true;

}

/* validation function for date - is it in the future? */
export function isFutureDate(value) {

  var fakedate = new Date(value.substr(6, 4), (value.substr(3, 2) - 1), value.substr(0, 2));
  var today = new Date();
  return fakedate > today;
}
