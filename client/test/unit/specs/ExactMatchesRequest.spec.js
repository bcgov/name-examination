/*eslint-disable*/
import sinon from 'sinon';
import axios from '@/axios-auth.js';
import store from '@/store'

describe('store > checkManualExactMatches', () => {

  let exactMatch;

  beforeEach(() => {
    exactMatch = sinon.fake.resolves({data: {names: []}})
    sinon.replace(axios, 'get', exactMatch);
  })
  afterEach(() => {
    sinon.restore()
  })

  it('removes the leading plus', () => {
    store.dispatch('checkManualExactMatches', '+dog')

    expect(exactMatch.lastCall.args[0]).toEqual('/api/v1/exact-match?query=dog')
  })

  it('keeps query as-is when there is no leading plus', () => {
    store.dispatch('checkManualExactMatches', 'dog')

    expect(exactMatch.lastCall.args[0]).toEqual('/api/v1/exact-match?query=dog')
  })

  it('encodes the query', () => {
    store.dispatch('checkManualExactMatches', 'dog&cat')

    expect(exactMatch.lastCall.args[0]).toEqual('/api/v1/exact-match?query=dog%26cat')
  })

  it('changes the money symbols', () => {
    store.dispatch('checkManualExactMatches', 'my $ $tore ¢ a¢¢ept ')

    expect(exactMatch.lastCall.args[0]).toEqual('/api/v1/exact-match?query=my%20DOLLAR%20Store%20CENT%20aCCept%20')
  })

  it('escape special characters', ()=>{
    store.dispatch('checkManualExactMatches', '/?.><\\\'\":;\\|][}{=+_-)(*&^%$#@!~`ATHENAE/?.><\\\'\":;\\|][}{=+_-)(*&^%$#@!~`UM 139 LTD./?.><\\\'":;\\|][}{=+_-)(*&^%$#@!~` +++++ ------')

    expect(exactMatch.lastCall.args[0]).toEqual('/api/v1/exact-match?query=.%3E%3C\'%3B%3D%2B_-*%26S%40ATHENAE.%3E%3C\'%3B%3D%2B_-*%26S%40UM%20139%20LTD..%3E%3C\'%3B%3D%2B_-*%26S%40%20%20')
  })
})
