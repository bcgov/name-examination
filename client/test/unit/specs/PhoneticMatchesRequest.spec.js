/*eslint-disable*/
import sinon from 'sinon';
import axios from '@/axios-auth.js';
import store from '@/store'

describe('store > checkManualPhoneticMatches', () => {

  let CobrsPhonetic;

  beforeEach(() => {
    CobrsPhonetic = sinon.fake.resolves({data: {names: []}})
    sinon.replace(axios, 'get', CobrsPhonetic);
  })
  afterEach(() => {
    sinon.restore()
  })

  it('replaces the plus with a space', () => {
    store.dispatch('checkManualPhoneticMatches', '+dog+cat + fish+')
    // let lastCallList = CobrsPhonetic.lastCall
    // console.log(lastCallList)
    // console.log(lastCallList.args)
    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/phonetics/ dog cat   fish ')
  })

  it('keeps query as-is when there is no leading plus', () => {
    store.dispatch('checkManualPhoneticMatches', 'dog')

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/phonetics/dog')
  })

  it('replaces the & with a space', () => {
    store.dispatch('checkManualPhoneticMatches', 'dog&cat & fish')

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/phonetics/dog cat   fish')
  })

  it('replaces / and \\ with a space', () => {
    store.dispatch('checkManualPhoneticMatches', 'dog/cat /fish \\ bear\\')

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/phonetics/dog cat  fish   bear ')
  })

  it('replaces - with a space', () => {
    store.dispatch('checkManualPhoneticMatches', 'dog-cat -fish - bear')

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/phonetics/dog cat  fish   bear')
  })

  it('replaces $ and ¢ with a dollar and cent, or s and c', () => {
    store.dispatch('checkManualPhoneticMatches', 'big $ $tore ¢ a¢¢eptable ')

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/phonetics/big DOLLAR Store CENT aCCeptable ')
  })

  it('removes brackets', () => {
    store.dispatch('checkManualPhoneticMatches', 'dog (cat) {fish} [bear]')

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/phonetics/dog cat fish bear')
  })

  it('removes ?', () => {
    store.dispatch('checkManualPhoneticMatches', 'dog ? cat? ?fish bear')

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/phonetics/dog  cat fish bear')
  })

  it('removes #', () => {
    store.dispatch('checkManualPhoneticMatches', 'dog # cat# #fish bear')

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/phonetics/dog  cat fish bear')
  })

  it('removes %', () => {
    store.dispatch('checkManualPhoneticMatches', 'dog % cat% %fish bear')

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/phonetics/dog  cat fish bear')
  })

  it('escape special characters', () => {
    store.dispatch('checkManualPhoneticMatches', '/?.><\\\'\":;\\|][}{=+_-)(*&^%$#@!~`ATHENAE/?.><\\\'\":;\\|][}{=+_-)(*&^%$#@!~`UM 139 LTD./?.><\\\'":;\\|][}{=+_-)(*&^%$#@!~`')

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/phonetics/ .>< \'; = _ * S@ATHENAE .>< \'; = _ * S@UM 139 LTD. .>< \'; = _ * S@')
  })
})
