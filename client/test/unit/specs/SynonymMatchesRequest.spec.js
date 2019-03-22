/*eslint-disable*/
import sinon from 'sinon';
import axios from '@/axios-auth.js';
import store from '@/store'

describe('store > checkManualSynonymMatches', () => {

  let SynonymMatch;

  beforeEach(() => {
    SynonymMatch = sinon.fake.resolves({data: {names: []}})
    sinon.replace(axios, 'get', SynonymMatch);
  })
  afterEach(() => {
    sinon.restore()
  })

  it('replaces the plus with a space', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'+dog+cat + fish+', exactPhrase:''})
    // let lastCallList = SynonymMatch.lastCall
    // console.log(lastCallList)
    // console.log(lastCallList.args)
    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/ dog cat   fish /*')
  })

  it('keeps query as-is when there is no leading plus', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'dog',exactPhrase:''})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog/*')
  })

  it('replaces the & with a space', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'dog&cat & fish',exactPhrase:''})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog cat   fish/*')
  })

  it('replaces / and \\ with a space', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'dog/cat /fish \\ bear\\',exactPhrase:''})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog cat  fish   bear /*')
  })

  it('replaces - with a space', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'dog-cat -fish - bear',exactPhrase:''})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog cat  fish   bear/*')
  })

  it('replaces $ and ¢ with a dollar and cent, or s and c', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'big $ $tore ¢ a¢¢eptable ',exactPhrase:''})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/big DOLLAR Store CENT aCCeptable /*')
  })

  it('removes brackets', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'dog (cat) {fish} [bear]',exactPhrase:''})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog cat fish bear/*')
  })

  it('removes ?', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'dog ? cat? ?fish bear',exactPhrase:''})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog  cat fish bear/*')
  })

  it('removes #', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'dog # cat# #fish bear',exactPhrase:''})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog  cat fish bear/*')
  })

  it('removes %', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'dog % cat% %fish bear',exactPhrase:''})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog  cat fish bear/*')
  })

  it('escape special characters', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'/?.><\\\'\":;\\|][}{=+_-)(*&^%$#@!~`ATHENAE/?.><\\\'\":;\\|][}{=+_-)(*&^%$#@!~`UM 139 LTD./?.><\\\'":;\\|][}{=+_-)(*&^%$#@!~`',exactPhrase:''})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/ .>< \'; = _ * S@ATHENAE .>< \'; = _ * S@UM 139 LTD. .>< \'; = _ * S@/*')
  })

  it('sends exact phrase', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'testing exact phrase',exactPhrase:'exact phrase'})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/testing exact phrase/exact phrase')
  })

  it('can search empty string', () => {
    store.dispatch('checkManualSynonymMatches', {searchStr:'',exactPhrase:''})

    expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/*/*')
  })
})
