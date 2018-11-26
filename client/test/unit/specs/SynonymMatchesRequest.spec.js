/*eslint-disable*/
import sinon from 'sinon';
import axios from '@/axios-auth.js';
import store from '@/store'

describe('store > checkManualSynonymMatches', () => {

    let SynonymMatch;

    beforeEach(() => {
        SynonymMatch = sinon.fake.resolves({ data: { names:[] } })
        sinon.replace(axios, 'get', SynonymMatch);
    })
    afterEach(()=>{
        sinon.restore()
    })

    it('replaces the plus with a space', ()=>{
        store.dispatch('checkManualSynonymMatches', '+dog+cat + fish+')
        // let lastCallList = SynonymMatch.lastCall
        // console.log(lastCallList)
        // console.log(lastCallList.args)
        expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/ dog cat   fish ')
    })

    it('keeps query as-is when there is no leading plus', ()=>{
        store.dispatch('checkManualSynonymMatches', 'dog')

        expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog')
    })

    it('replaces the & with a space', ()=>{
        store.dispatch('checkManualSynonymMatches', 'dog&cat & fish')

        expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog cat   fish')
    })

    it('replaces / and \\ with a space', ()=>{
        store.dispatch('checkManualSynonymMatches', 'dog/cat /fish \\ bear\\')

        expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog cat  fish   bear ')
    })

    it('replaces - with a space', ()=>{
        store.dispatch('checkManualSynonymMatches', 'dog-cat -fish - bear')

        expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog cat  fish   bear')
    })

    it('removes brackets', ()=>{
        store.dispatch('checkManualSynonymMatches', 'dog (cat) {fish} [bear]')

        expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog cat fish bear')
    })

    it('removes ?', ()=>{
        store.dispatch('checkManualSynonymMatches', 'dog ? cat? ?fish bear')

        expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog  cat fish bear')
    })

    it('removes #', ()=>{
        store.dispatch('checkManualSynonymMatches', 'dog # cat# #fish bear')

        expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog  cat fish bear')
    })

    it('removes @', ()=>{
        store.dispatch('checkManualSynonymMatches', 'dog @ cat@ @fish bear')

        expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog  cat fish bear')
    })

    it('removes %', ()=>{
        store.dispatch('checkManualSynonymMatches', 'dog % cat% %fish bear')

        expect(SynonymMatch.lastCall.args[0]).toEqual('/api/v1/requests/synonymbucket/dog  cat fish bear')
    })


})
