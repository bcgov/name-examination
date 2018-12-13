/*eslint-disable*/
import sinon from 'sinon';
import axios from '@/axios-auth.js';
import store from '@/store'

describe('store > checkManualExactMatches', () => {

    let exactMatch;

    beforeEach(() => {
        exactMatch = sinon.fake.resolves({ data: { names:[] } })
        sinon.replace(axios, 'get', exactMatch);
    })
    afterEach(()=>{
        sinon.restore()
    })

    it('removes the leading plus', ()=>{
        store.dispatch('checkManualExactMatches', '+dog')

        expect(exactMatch.lastCall.args[0]).toEqual('/api/v1/exact-match?query=dog')
    })

    it('keeps query as-is when there is no leading plus', ()=>{
        store.dispatch('checkManualExactMatches', 'dog')

        expect(exactMatch.lastCall.args[0]).toEqual('/api/v1/exact-match?query=dog')
    })

    it('encodes the query', ()=>{
        store.dispatch('checkManualExactMatches', 'dog&cat')

        expect(exactMatch.lastCall.args[0]).toEqual('/api/v1/exact-match?query=dog%26cat')
    })

    it('changes the money symbols', ()=>{
        store.dispatch('checkManualExactMatches', 'my $ $tore ¢ a¢¢ept ')

        expect(exactMatch.lastCall.args[0]).toEqual('/api/v1/exact-match?query=my%20dollar%20store%20cent%20accept%20')
    })

})
