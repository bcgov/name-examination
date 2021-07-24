import sinon from 'sinon'
import axios from '@/axios-auth.js'
import store from '@/store'

describe('store > checkManualPhoneticMatches', () => {
  let CobrsPhonetic

  beforeEach(() => {
    CobrsPhonetic = sinon.fake.resolves({ data: { names: [] } })
    sinon.replace(axios, 'get', CobrsPhonetic)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('replaces the plus with a space', () => {
    store.dispatch('checkManualPhoneticMatches', { searchStr: '+dog+cat + fish+', exactPhrase: '' })
    // let lastCallList = CobrsPhonetic.lastCall
    //
    //
    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/ dog cat   fish /*')
  })

  it('keeps query as-is when there is no leading plus', () => {
    store.dispatch('checkManualPhoneticMatches', { searchStr: 'dog', exactPhrase: '' })

    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/dog/*')
  })

  it('replaces the & with a space', () => {
    store.dispatch('checkManualPhoneticMatches', { searchStr: 'dog&cat & fish', exactPhrase: '' })

    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/dog cat   fish/*')
  })

  it('replaces / and \\ with a space', () => {
    store.dispatch('checkManualPhoneticMatches', { searchStr: 'dog/cat /fish \\ bear\\', exactPhrase: '' })

    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/dog cat  fish   bear /*')
  })

  it('replaces - with a space', () => {
    store.dispatch('checkManualPhoneticMatches', { searchStr: 'dog-cat -fish - bear', exactPhrase: '' })

    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/dog cat  fish   bear/*')
  })

  it('replaces $ and ¢ with a dollar and cent, or s and c', () => {
    store.dispatch('checkManualPhoneticMatches', { searchStr: 'big $ $tore ¢ a¢¢eptable ', exactPhrase: '' })

    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/big DOLLAR Store CENT aCCeptable /*')
  })

  it('removes brackets', () => {
    store.dispatch('checkManualPhoneticMatches', { searchStr: 'dog (cat) {fish} [bear]', exactPhrase: '' })

    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/dog cat fish bear/*')
  })

  it('removes ?', () => {
    store.dispatch('checkManualPhoneticMatches', { searchStr: 'dog ? cat? ?fish bear', exactPhrase: '' })

    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/dog  cat fish bear/*')
  })

  it('removes #', () => {
    store.dispatch('checkManualPhoneticMatches', { searchStr: 'dog # cat# #fish bear', exactPhrase: '' })

    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/dog  cat fish bear/*')
  })

  it('removes %', () => {
    store.dispatch('checkManualPhoneticMatches', { searchStr: 'dog % cat% %fish bear', exactPhrase: '' })

    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/dog  cat fish bear/*')
  })

  it('escape special characters', () => {
    store.dispatch('checkManualPhoneticMatches', {
      searchStr: '/?.><\\\'\":;\\|][}{=+_-)(*&^%$#@!~`ATHENAE/?.><\\\'\":;\\|][}{=+_-)(*&^%$#@!~`UM 139 LTD./?.><\\\'":;\\|][}{=+_-)(*&^%$#@!~`',
      exactPhrase: '',
    })

    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/ .>< \'; = _ * S@ATHENAE .>< \'; = _ * S@UM 139 LTD. .>< \'; = _ * S@/*')
  })

  it('escape special characters', () => {
    store.dispatch('checkManualPhoneticMatches', { searchStr: '', exactPhrase: '' })

    expect(CobrsPhonetic.lastCall.args[0])
      .toEqual('/api/v1/requests/phonetics/*/*')
  })
})
