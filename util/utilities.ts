/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
import removeAccents from 'remove-accents'

export function removeExcessSpaces (name: string): string {
  // trims any spaces padding <name> and any internal spaces between words in excess of a single space per two words.
  name = name.replace(/\s\s+/g, ' ')
  return name.trim()
}

export function sanitizeName (name: string): string {
  if (!name) return '' // safety check

  // replaces most characters from the extended-latin character set, such as those modified with diacritics, and most
  // ligatures, with their closest ASCII equivalents (eg. é => e, ø => o, æ => ae); removes any symbols outside of
  // the limited set supported by Namex; capitalizes; and trims any spaces padding <name> and any internal spaces
  // between words in excess of a single space per two words.
  name = removeAccents(name)
  // eslint-disable-next-line no-useless-escape
  name = name.replace(/[^\sa-zA-Z0-9^\[\]*/+&().,="'#@!?;:-]/g, '')
  return removeExcessSpaces(name.toUpperCase())
}

export function replaceWord (name: string, word: string, substitution: string | null = null): string {
  // when called with 2 arguments (<name> and <word>), finds all matches of <word> within <name> according to the same
  // rules as matchWord above, replaces them with nothing (ie. removes them), and returns <name>.  When called with 3
  // arguments, it finds the first match for <word> in <name>, replaces it with <substitution>, and returns <name>.  In
  // either case, if there are no matches, <name> is returned without modification (aside from capitalization)
  if (name) name = name.toUpperCase()
  if (word) word = word.toUpperCase()

  if (containsLongAndShortDesignation(name, word)) {
    return name
  }
  function escWrd (w: string) {
    return w.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')
  }
  function replWrd (n: string) {
    return n.replace(new RegExp('(\\s|^)' + escWrd(word) + '(\\s|$)'), ' ')
  }
  if (substitution) {
    substitution = ' ' + substitution.toUpperCase() + ' '
    name = name.replace(new RegExp('(\\s|^)' + escWrd(word) + '(\\s|$)'), substitution)
  } else {
    while (name !== replWrd(name)) {
      name = replWrd(name)
    }
  }
  return removeExcessSpaces(name)
}

export function containsLongAndShortDesignation (name: string, word: string): boolean {
  if (word) word = word.toUpperCase()
  if (name) name = name.toUpperCase()

  if (word === 'LIMITED') {
    const designationsContainingWord = [
      ' LIMITED LIABILITY CO.',
      ' LIMITED LIABILITY COMPANY',
      ' LIMITED LIABILITY PARTNERSHIP',
      ' LIMITED PARTNERSHIP'
    ]
    for (const designation of designationsContainingWord) {
      if (name.includes(designation)) {
        return true
      }
    }
  }
  if (word === 'LIMITEE') {
    const designationsContainingWord = [
      ' SOCIETE A RESPONSABILITE LIMITEE',
      ' SOCIETE EN NOM COLLECTIF A RESPONSABILITE LIMITEE'
    ]
    for (const designation of designationsContainingWord) {
      if (name.includes(designation)) {
        return true
      }
    }
  }
  return false
}

export function isSigningIn (): boolean {
  const path = window.location.pathname
  const hashFragment = window.location.hash
  return path.includes('/signin') || path.includes('/signin-redirect') || path.includes('/signin-redirect-full') ||
  hashFragment.includes('#state')
}

export function isSigningOut (): boolean {
  const path = window.location.pathname
  return path.includes('/signout')
}
