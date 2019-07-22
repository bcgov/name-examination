import store from '@/store'

describe('store > setSynonymMatchesConflicts', () => {

  it('resists empty data', () => {
    store.commit('setSynonymMatchesConflicts', { names: [] })

    expect(store.state.synonymMatchesConflicts)
    .toEqual([])
  })

  describe('class marker', () => {

    let data
    beforeEach(() => {
      store.commit('setSynonymMatchesConflicts', {
        names: [
          { name_info: { name: 'first title - meta' }, stems: [] },
          { name_info: { name: 'first match', source: 'CORP' }, stems: [] },
          { name_info: { name: 'second title - meta' }, stems: [] },
          { name_info: { name: 'second match', source: 'CORP' }, stems: [] },
          { name_info: { name: 'second match #2', source: 'CORP' }, stems: [] },
          { name_info: { name: 'third title - meta' }, stems: [] },
          { name_info: { name: 'third match', source: 'CORP' }, stems: [] },
          { name_info: { name: 'third match #2', source: 'CORP' }, stems: [] },
        ],
      })
      data = store.state.parsedSynonymConflicts
    })

    it('all the items in the array are conflict-synonym-titles', () => {
      expect(data.every(title => title.class === 'conflict-synonym-title')).toBeTruthy()
    })
    it('every child conflict is a conflict result', () => {
      expect(data.every(title => title.children.every(child => child.class === 'conflict-result'))).toBeTruthy()
    })
    it('includes counts correctly', () => {
      expect(data.every(title => title.count === title.children.length)).toBeTruthy()
    })

    describe('no match', () => {

      let data
      beforeEach(() => {
        store.commit('setSynonymMatchesConflicts', {
          names: [
            { name_info: { name: 'first title - meta' }, stems: [] },
            { name_info: { name: 'second title - meta' }, stems: [] },
          ],
        })
        data = store.state.parsedSynonymConflicts
      })

      it('it has two titles', () => {
        expect(data[0].class).toEqual('conflict-synonym-title')
        expect(data[1].class).toEqual('conflict-synonym-title')
      })
      it('counts are zero', () => {
        expect(data[0].count).toEqual(0)
        expect(data[1].count).toEqual(0)
      })
      it('and no children', () => {
        expect(data[0].children.length).toEqual(0)
        expect(data[1].children.length).toEqual(0)
      })
    })
  })
})
