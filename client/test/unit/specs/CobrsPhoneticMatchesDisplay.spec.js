/* eslint-disable */
import Vue from 'vue'
import store from '@/store'
import ConflictList from '@/components/application/examine/recipe/conflicts/ConflictList'
import { sleep } from '@/utils/sleep'

describe('ConflictList.vue cobrs phonetic matches titles and children classes', () => {
  const Constructor = Vue.extend(ConflictList)
  const vm = new Constructor({ store }).$mount()

  beforeEach(async () => {
    vm.$store.commit('setCobrsPhoneticConflicts', {
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
    await sleep(2000)
  })

  it('renders correctly', () => {
    let data = vm.$store.state.parsedCOBRSConflicts
    expect(data[0].class).toEqual('conflict-cobrs-phonetic-title')
    expect(data[1].class).toEqual('conflict-cobrs-phonetic-title')
    expect(data[0].children[0].class).toEqual('conflict-result')
  })
})
