import { describe, expect, it } from 'vitest'
import {
  highlightConflictName,
  initialsGroupComponentLetters,
  visualExactTerms,
} from '~/util/html/conflict-highlight'

const exactSpan = (text: string) => `<span class="exact-highlight">${text}</span>`

function paint(
  query: string,
  name: string,
  exact: string[]
): string {
  return highlightConflictName(name, { exact, synonyms: [], stems: [] }, query)
}

describe('initialsGroupComponentLetters', () => {
  it('recognizes spaced, dotted, and ampersand 3+ groups', () => {
    for (const query of [
      'J R M INVESTMENTS',
      'J.R.M. INVESTMENTS',
      'J&R&M INVESTMENTS',
    ]) {
      expect([...initialsGroupComponentLetters(query)].sort()).toEqual(['J', 'M', 'R'])
    }
  })

  it('recognizes JOSH spaced initials', () => {
    expect([...initialsGroupComponentLetters('J O S H INVESTMENTS')].sort()).toEqual([
      'H',
      'J',
      'O',
      'S',
    ])
  })

  it('does not treat 2-letter or glued tokens as a 3+ group', () => {
    expect(initialsGroupComponentLetters('H H INVESTMENTS').size).toBe(0)
    expect(initialsGroupComponentLetters('H&H INVESTMENTS').size).toBe(0)
    expect(initialsGroupComponentLetters('HH INVESTMENTS').size).toBe(0)
    expect(initialsGroupComponentLetters('H INVESTMENTS').size).toBe(0)
    expect(initialsGroupComponentLetters('JRM INVESTMENTS').size).toBe(0)
    expect(initialsGroupComponentLetters('VAN INVESTMENTS').size).toBe(0)
    expect(initialsGroupComponentLetters('NEW WEST').size).toBe(0)
    expect(initialsGroupComponentLetters('BE KIND').size).toBe(0)
  })
})

describe('visualExactTerms', () => {
  it('drops component initials and keeps grouped + whole words', () => {
    expect(
      visualExactTerms(['J', 'R', 'M', 'INVESTMENTS'], 'J R M INVESTMENTS')
    ).toEqual(['INVESTMENTS'])
    expect(
      visualExactTerms(['JRM', 'INVESTMENTS'], 'J R M INVESTMENTS')
    ).toEqual(['JRM', 'INVESTMENTS'])
  })

  it('leaves H/HH exact terms intact', () => {
    expect(visualExactTerms(['H', 'INVESTMENTS'], 'H H INVESTMENTS')).toEqual([
      'H',
      'INVESTMENTS',
    ])
    expect(visualExactTerms(['H', 'INVESTMENTS'], 'H&H INVESTMENTS')).toEqual([
      'H',
      'INVESTMENTS',
    ])
    expect(visualExactTerms(['H', 'INVESTMENTS'], 'H INVESTMENTS')).toEqual([
      'H',
      'INVESTMENTS',
    ])
  })
})

describe('highlightConflictName', () => {
  const jrmQuery = 'J R M INVESTMENTS'
  const jrmExact = ['J', 'R', 'M', 'INVESTMENTS']
  const jrmGrouped = ['JRM', 'INVESTMENTS']

  it('paints JRM + INVESTMENTS on the grouped candidate', () => {
    const html = paint(jrmQuery, 'JRM INVESTMENTS LTD.', jrmGrouped)
    expect(html).toContain(exactSpan('JRM'))
    expect(html).toContain(exactSpan('INVESTMENTS'))
    expect(html).not.toMatch(/exact-highlight">[JRM]</)
  })

  it('does not paint J/R/M inside weaker JRM-query candidates', () => {
    const research = paint(jrmQuery, 'M J RESEARCH INVESTMENTS LTD.', jrmExact)
    expect(research).toContain(exactSpan('INVESTMENTS'))
    expect(research).not.toContain(exactSpan('M'))
    expect(research).not.toContain(exactSpan('J'))
    expect(research).not.toContain(exactSpan('R'))
    expect(research).toContain('RESEARCH')
    expect(research).not.toMatch(/RESEA<span/)

    const jr = paint(jrmQuery, 'J & R INVESTMENTS LTD.', jrmExact)
    expect(jr).toContain(exactSpan('INVESTMENTS'))
    expect(jr).not.toContain(`>J<`)
    expect(jr).not.toContain(`>R<`)

    const rcj = paint(jrmQuery, 'R C J INVESTMENTS LTD.', jrmExact)
    expect(rcj).toContain(exactSpan('INVESTMENTS'))
    expect(rcj).not.toContain(exactSpan('R'))
    expect(rcj).not.toContain(exactSpan('C'))
    expect(rcj).not.toContain(exactSpan('J'))

    const jm = paint(jrmQuery, 'J & M INVESTMENTS LTD.', jrmExact)
    expect(jm).toContain(exactSpan('INVESTMENTS'))
    expect(jm).not.toContain(exactSpan('J'))
    expect(jm).not.toContain(exactSpan('M'))
  })

  it('applies the same visual rule for dotted and ampersand JRM queries', () => {
    for (const query of ['J.R.M. INVESTMENTS', 'J&R&M INVESTMENTS']) {
      const strong = paint(query, 'JRM INVESTMENTS LTD.', jrmGrouped)
      expect(strong).toContain(exactSpan('JRM'))
      expect(strong).toContain(exactSpan('INVESTMENTS'))
      const weak = paint(query, 'M J RESEARCH INVESTMENTS LTD.', jrmExact)
      expect(weak).toContain(exactSpan('INVESTMENTS'))
      expect(weak).not.toMatch(/RESEA<span/)
    }
  })

  it('paints JOSH + INVESTMENTS and not O inside INCORPORATED', () => {
    const query = 'J O S H INVESTMENTS'
    const html = paint(query, 'JOSH INVESTMENTS INCORPORATED', [
      'J',
      'O',
      'S',
      'H',
      'JOSH',
      'INVESTMENTS',
    ])
    expect(html).toContain(exactSpan('JOSH'))
    expect(html).toContain(exactSpan('INVESTMENTS'))
    expect(html).toContain('INCORPORATED')
    expect(html).not.toMatch(/INC<span/)
    expect(html).not.toContain(exactSpan('O'))
  })

  it('leaves VAN, NEW WEST, and BE KIND paint unchanged', () => {
    expect(paint('VAN INVESTMENTS', "VAN'S INVESTMENTS LTD.", ['VAN', 'INVESTMENTS'])).toBe(
      `${exactSpan('VAN')}'S ${exactSpan('INVESTMENTS')} LTD.`
    )
    expect(paint('NEW WEST', 'NEW WEST TRANSPORT LTD.', ['NEW', 'WEST'])).toBe(
      `${exactSpan('NEW')} ${exactSpan('WEST')} TRANSPORT LTD.`
    )
    expect(
      paint('BE KIND', 'BE KIND OKANAGAN GROWERS AND COMPASSION CLUB INC.', ['BE', 'KIND'])
    ).toContain(`${exactSpan('BE')} ${exactSpan('KIND')}`)
  })

  it('preserves H H / H&H / H INVESTMENTS standalone H paint', () => {
    const hhName = 'H. & H. INVESTMENTS LTD.'
    for (const query of ['H H INVESTMENTS', 'H&H INVESTMENTS', 'HH INVESTMENTS']) {
      const html = paint(query, hhName, ['H', 'INVESTMENTS'])
      expect(html).toContain(exactSpan('H'))
      expect(html).toContain(exactSpan('INVESTMENTS'))
    }
    expect(paint('H INVESTMENTS', 'H INVESTMENTS LTD.', ['H', 'INVESTMENTS'])).toBe(
      `${exactSpan('H')} ${exactSpan('INVESTMENTS')} LTD.`
    )
  })

  it('does not substring-paint remaining 1-character exact terms inside words', () => {
    const html = highlightConflictName(
      'RESEARCH MANAGEMENT',
      { exact: ['M', 'R'], synonyms: [], stems: [] },
      'H INVESTMENTS'
    )
    expect(html).toBe('RESEARCH MANAGEMENT')
  })
})
