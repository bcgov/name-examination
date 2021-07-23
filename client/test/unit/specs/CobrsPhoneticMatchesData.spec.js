import store from '@/store'

describe('store > setCobrsPhoneticConflicts', () => {
  it('resists empty data', () => {
    store.commit('setCobrsPhoneticConflicts', {names: []})

    expect(store.state.cobrsPhoneticConflicts).toEqual([])
  })

  describe('class marker', () => {
    var data

    beforeEach(() => {
      store.commit('setCobrsPhoneticConflicts', {
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
      data = store.state.parsedCOBRSConflicts
    })

    it('all the items in the array are conflict-cobrs-phonetic-titles', () => {
      expect(data.every(title => title.class === 'conflict-cobrs-phonetic-title')).toBeTruthy()
    })

    it('every child conflict is a conflict result', () => {
      expect(data.every(title => title.children.every(child => child.class === 'conflict-result'))).toBeTruthy()
    })

    it('includes counts correctly', () => {
      expect(data.every(title => title.count === title.children.length)).toBeTruthy()
    })

    describe('no match', () => {
      var data

      beforeEach(() => {
        store.commit('setCobrsPhoneticConflicts', {
          names: [
            {name_info: {name: 'first title'}, stems: []},
            {name_info: {name: 'second title'}, stems: []}
          ]
        })
        data = store.state.parsedCOBRSConflicts
      })

      it('it has two titles', () => {
        expect(data[0].class).toEqual('conflict-cobrs-phonetic-title')
        expect(data[1].class).toEqual('conflict-cobrs-phonetic-title')
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
