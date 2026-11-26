import { describe, expect, it } from 'vitest'
import { splitDistinctiveDescriptive } from '~/util/split-name'

describe('splitDistinctiveDescriptive', () => {
  it.each([
    [
      'MIHAI DINU BUSINESS ANALYSIS SERVICES INC.',
      'MIHAI DINU BUSINESS ANALYSIS',
      'SERVICES INC.',
    ],
    ['DAVE MCK WOOD WORK INC.', 'DAVE MCK WOOD', 'WORK INC.'],
    [
      'BRITISH COLUMBIA DECONSTRUCTIONISTS LTD.',
      'BRITISH COLUMBIA',
      'DECONSTRUCTIONISTS LTD.',
    ],
    [
      'WEST COAST TRUCKING LIMITED LIABILITY COMPANY',
      'WEST COAST',
      'TRUCKING LIMITED LIABILITY COMPANY',
    ],
    ['KLASSY POUR MOBILE BAR', 'KLASSY POUR MOBILE', 'BAR'],
    ['ZEDFOX LTD.', 'ZEDFOX', 'LTD.'],
    ['ZEDFOX', 'ZEDFOX', ''],
    ['  ', '', ''],
  ])('splits %s', (name, distinctive, descriptive) => {
    expect(splitDistinctiveDescriptive(name)).toEqual({
      distinctive,
      descriptive,
    })
  })
})
