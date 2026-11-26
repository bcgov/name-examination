/** Designation words, matching the list namex-solr-api strips (DEFAULT_DESIGNATIONS). */
const DESIGNATION_WORDS = new Set([
  'association',
  'assoc',
  'assoc.',
  'assn',
  'assn.',
  'company',
  'co',
  'co.',
  'corporation',
  'corp',
  'corp.',
  'incorporated',
  'inc',
  'inc.',
  'incorporee',
  'liability',
  'limited',
  'ltd',
  'ltd.',
  'limitee',
  'ltee',
  'ltee.',
  'society',
  'soc',
  'soc.',
  'ulc',
  'ulc.',
  'unlimited',
  'l.l.c.',
  'llc',
  'llp',
  'sencrl',
  'srl',
])

/**
 * Split a name for the Distinctive / Descriptive search boxes.
 * Distinctive: the left-most words, minus the right-most word and the designation.
 * Descriptive: the right-most word and the designation.
 */
export function splitDistinctiveDescriptive(name: string): {
  distinctive: string
  descriptive: string
} {
  const words = name.trim().split(/\s+/).filter(Boolean)
  let end = words.length
  while (end > 0 && DESIGNATION_WORDS.has(words[end - 1]!.toLowerCase())) end--
  const split = end > 1 ? end - 1 : end
  return {
    distinctive: words.slice(0, split).join(' '),
    descriptive: words.slice(split).join(' '),
  }
}
