/*eslint-disable*/
export function isNotBlankSpace(value) {
  if (value)
    return value.replace(/\s/g,'')!='';
  return false;
}
