import store from '@/store'

describe('store > setPhoneticConflicts', () => {

  it('resists empty data', () => {
    store.commit('setPhoneticConflicts', {names: []})

    expect(store.state.phoneticConflicts).toEqual([])
  })

  describe('class marker', () => {

    var data
    beforeEach(() => {
      store.commit('setPhoneticConflicts', {
        names: [
          {name_info: {name: 'first title'}, stems: []},
          {name_info: {name: 'first match', source: 'CORP'}, stems: []},
          {name_info: {name: 'second title'}, stems: []},
          {name_info: {name: 'second match', source: 'CORP'}, stems: []},
          {name_info: {name: 'second match #2', source: 'CORP'}, stems: []},
          {name_info: {name: 'third title'}, stems: []},
          {name_info: {name: 'third match', source: 'CORP'}, stems: []},
          {name_info: {name: 'third match #2', source: 'CORP'}, stems: []},
        ]
      })
      data = store.state.parsedPhoneticConflicts
    })

    it('all the entries are conflict-phonetic-titles', () => {
      expect(data.every(d => d.class === 'conflict-phonetic-title')).toBeTruthy()
    })
    it('all the children of the entries are conflict-results', () => {
      expect(data.every(d => d.children.every(child => child.class === 'conflict-result'))).toBeTruthy()
    })
    it('entries have correct counts', () => {
      expect(data[0].count).toEqual(1)
      expect(data[1].count).toEqual(2)
      expect(data[2].count).toEqual(2)
    })

    describe('no match', () => {

      var data
      beforeEach(() => {
        store.commit('setPhoneticConflicts', {
          names: [
            {name_info: {name: 'first title'}, stems: []},
            {name_info: {name: 'second title'}, stems: []}
          ]
        })
        data = store.state.parsedPhoneticConflicts
      })
      it('has count of 0', () => {
        expect(data[0].count).toEqual(0)
      })
      it('lives alone', () => {
        expect(data.length).toEqual(2)
      })
    })
  })
})
