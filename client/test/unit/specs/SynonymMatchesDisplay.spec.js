import Vue from 'vue'
import store from '@/store'
import ConflictList from '@/components/application/examine/recipe/conflicts/ConflictList'

describe('ConflictList.vue synonym matches', () => {

  let vm
  let data

  beforeEach((done) => {
    const Constructor = Vue.extend(ConflictList)
    vm = new Constructor({ store: store }).$mount()
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
    setTimeout(() => { done() }, 3000)
  })

  it('all the items in the array are conflict-synonym-titles', () => {
    data = vm.$store.state.parsedSynonymConflicts
    expect(data.every(title => title.class === 'conflict-synonym-title')).toBeTruthy()
  })
  it('every child conflict is a conflict result', () => {
    data = vm.$store.state.parsedSynonymConflicts
    expect(data.every(title => title.children.every(child => child.class === 'conflict-result'))).toBeTruthy()
  })
  it('includes counts correctly', () => {
    data = vm.$store.state.parsedSynonymConflicts
    expect(data.every(title => title.count === title.children.length)).toBeTruthy()
  })
})
