/*eslint-disable*/
import sinon from 'sinon';
import axios from '@/axios-auth.js';
import store from '@/store'

describe('store > checkManualCobrsPhoneticMatches', () => {

  let CobrsPhonetic;

  beforeEach(() => {
    CobrsPhonetic = sinon.fake.resolves({data: {names: []}})
    sinon.replace(axios, 'get', CobrsPhonetic);
  })
  afterEach(() => {
    sinon.restore()
  })

  it('replaces the plus with a space', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'+dog+cat + fish+',exactPhrase:''})
    // let lastCallList = CobrsPhonetic.lastCall
    //
    //
    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/ dog cat   fish /*')
  })

  it('keeps query as-is when there is no leading plus', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'dog',exactPhrase:''})

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog/*')
  })

  it('replaces the & with a space', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'dog&cat & fish',exactPhrase:''})

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog cat   fish/*')
  })

  it('replaces / and \\ with a space', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'dog/cat /fish \\ bear\\',exactPhrase:''})

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog cat  fish   bear /*')
  })

  it('replaces - with a space', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'dog-cat -fish - bear',exactPhrase:''})

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog cat  fish   bear/*')
  })

  it('replaces $ and ¢ with a dollar and cent, or s and c', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'big $ $tore ¢ a¢¢eptable ',exactPhrase:''})

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/big DOLLAR Store CENT aCCeptable /*')
  })

  it('removes brackets', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'dog (cat) {fish} [bear]',exactPhrase:''})

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog cat fish bear/*')
  })

  it('removes ?', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'dog ? cat? ?fish bear',exactPhrase:''})

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog  cat fish bear/*')
  })

  it('removes #', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'dog # cat# #fish bear',exactPhrase:''})

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog  cat fish bear/*')
  })

  it('removes %', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'dog % cat% %fish bear',exactPhrase:''})

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog  cat fish bear/*')
  })

  it('escape special characters', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'/?.><\\\'\":;\\|][}{=+_-)(*&^%$#@!~`ATHENAE/?.><\\\'\":;\\|][}{=+_-)(*&^%$#@!~`UM 139 LTD./?.><\\\'":;\\|][}{=+_-)(*&^%$#@!~`',exactPhrase:''})

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/ .>< \'; = _ * S@ATHENAE .>< \'; = _ * S@UM 139 LTD. .>< \'; = _ * S@/*')
  })

  it('searches on empty', () => {
    store.dispatch('checkManualCobrsPhoneticMatches', {searchStr:'',exactPhrase:''})

    expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/*/*')
  })
})
