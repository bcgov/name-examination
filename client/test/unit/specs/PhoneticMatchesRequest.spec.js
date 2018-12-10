/*eslint-disable*/
import sinon from 'sinon';
import axios from '@/axios-auth.js';
import store from '@/store'

describe('store > checkManualPhoneticMatches', () => {

    let phoneticMatch;

    beforeEach(() => {
        phoneticMatch = sinon.fake.resolves({ data: { names:[] } })
        sinon.replace(axios, 'get', phoneticMatch);
    })
    afterEach(()=>{
        sinon.restore()
    })

    it('calls the expected endpoint', ()=>{
        store.dispatch('checkManualPhoneticMatches', 'dog')

        expect(phoneticMatch.lastCall.args[0]).toEqual('/api/v1/sounds-like?query=dog')
    })

    it('encodes the query', ()=>{
        store.dispatch('checkManualPhoneticMatches', 'dog&cat')

        expect(phoneticMatch.lastCall.args[0]).toEqual('/api/v1/sounds-like?query=dog%26cat')
    })

    it('removes brackets', ()=>{
        store.dispatch('checkManualPhoneticMatches', 'dog (cat) {fish} [bear]')

        expect(phoneticMatch.lastCall.args[0]).toEqual('/api/v1/sounds-like?query=dog%20cat%20fish%20bear')
    })
    it('replaces + and - with spaces', ()=>{
        store.dispatch('checkManualPhoneticMatches', 'dog +cat -fish')

        expect(phoneticMatch.lastCall.args[0]).toEqual('/api/v1/sounds-like?query=dog%20%20cat%20%20fish')
    })
    it('replaces / and \\ with a space', ()=>{
        store.dispatch('checkManualPhoneticMatches', 'dog/cat /fish \\bear')

        expect(phoneticMatch.lastCall.args[0]).toEqual('/api/v1/sounds-like?query=dog%20cat%20%20fish%20%20bear')
    })

})
