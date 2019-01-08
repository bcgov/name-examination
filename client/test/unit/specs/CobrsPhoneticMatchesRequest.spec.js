/*eslint-disable*/
import sinon from 'sinon';
import axios from '@/axios-auth.js';
import store from '@/store'

describe('store > checkManualCobrsPhoneticMatches', () => {

    let CobrsPhonetic;

    beforeEach(() => {
        CobrsPhonetic = sinon.fake.resolves({ data: { names:[] } })
        sinon.replace(axios, 'get', CobrsPhonetic);
    })
    afterEach(()=>{
        sinon.restore()
    })

    it('replaces the plus with a space', ()=>{
        store.dispatch('checkManualCobrsPhoneticMatches', '+dog+cat + fish+')
        // let lastCallList = CobrsPhonetic.lastCall
        // console.log(lastCallList)
        // console.log(lastCallList.args)
        expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/ dog cat   fish ')
    })

    it('keeps query as-is when there is no leading plus', ()=>{
        store.dispatch('checkManualCobrsPhoneticMatches', 'dog')

        expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog')
    })

    it('replaces the & with a space', ()=>{
        store.dispatch('checkManualCobrsPhoneticMatches', 'dog&cat & fish')

        expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog cat   fish')
    })

    it('replaces / and \\ with a space', ()=>{
        store.dispatch('checkManualCobrsPhoneticMatches', 'dog/cat /fish \\ bear\\')

        expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog cat  fish   bear ')
    })

    it('replaces - with a space', ()=>{
        store.dispatch('checkManualCobrsPhoneticMatches', 'dog-cat -fish - bear')

        expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog cat  fish   bear')
    })

    it('replaces $ and ¢ with a dollar and cent, or s and c', ()=>{
        store.dispatch('checkManualCobrsPhoneticMatches', 'big $ $tore ¢ a¢¢eptable ')

        expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/big DOLLAR Store CENT aCCeptable ')
    })

    it('removes brackets', ()=>{
        store.dispatch('checkManualCobrsPhoneticMatches', 'dog (cat) {fish} [bear]')

        expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog cat fish bear')
    })

    it('removes ?', ()=>{
        store.dispatch('checkManualCobrsPhoneticMatches', 'dog ? cat? ?fish bear')

        expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog  cat fish bear')
    })

    it('removes #', ()=>{
        store.dispatch('checkManualCobrsPhoneticMatches', 'dog # cat# #fish bear')

        expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog  cat fish bear')
    })

    it('removes %', ()=>{
        store.dispatch('checkManualCobrsPhoneticMatches', 'dog % cat% %fish bear')

        expect(CobrsPhonetic.lastCall.args[0]).toEqual('/api/v1/requests/cobrsphonetics/dog  cat fish bear')
    })


})
