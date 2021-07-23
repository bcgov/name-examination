import Vue from 'vue'
import store from '@/store'
import ConflictList from '@/components/application/Examine/Recipe/conflicts/ConflictList'

describe('ConflictList.vue phonetic matches titles and children classes', () => {
  const Constructor = Vue.extend(ConflictList)
  const vm = new Constructor({ store }).$mount()

  beforeEach(() => {
    vm.$store.commit('setPhoneticConflicts', {
      names: [ { name_info: { name: 'first title' }, stems: [] },
        { name_info: { name: 'first match', source: 'CORP' }, stems: [] },
        { name_info: { name: 'second title' }, stems: [] },
        { name_info: { name: 'second match', source: 'CORP' }, stems: [] },
        { name_info: { name: 'second match #2', source: 'CORP' }, stems: [] },
        { name_info: { name: 'third title' }, stems: [] },
        { name_info: { name: 'third match', source: 'CORP' }, stems: [] },
        { name_info: { name: 'third match #2', source: 'CORP' }, stems: [] } ],
    })
  })

  it('renders correctly', () => {
    let data = vm.$store.state.parsedPhoneticConflicts
    expect(data[0].class).toEqual('conflict-phonetic-title')
    expect(data[1].class).toEqual('conflict-phonetic-title')
    expect(data[1].count).toEqual(2)
    expect(data[0].children[0].class).toEqual('conflict-result')
    expect(data[2].count).toEqual(2)
  })
})
