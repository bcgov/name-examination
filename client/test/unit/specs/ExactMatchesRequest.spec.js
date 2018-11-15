import sinon from 'sinon';
import axios from '@/axios-auth.js';
import store from '@/store'

describe('store > checkManualExactMatches', () => {

    let sandbox;

    beforeEach(() => {
        sinon.restore()
        sandbox = sinon.createSandbox()
        jest.setTimeout(100000);
    })
    afterEach(()=>{
        sandbox.restore()
    })

    it('removes the leading plus', (done)=>{
        sandbox.getStub = sandbox.stub(axios, 'get');
        sandbox.getStub.withArgs('/api/v1/exact-match?query=dog', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: { names:[{ name:'any-name' }] } }))
        )
        store.dispatch('checkManualExactMatches', '+dog')

        setTimeout(()=>{
            expect(store.state.exactMatchesConflicts).toEqual([{ text:'any-name' }])
            done();
        }, 300)
    })

    it('keeps query as-is when there is no leading plus', (done)=>{
        sandbox.getStub = sandbox.stub(axios, 'get');
        sandbox.getStub.withArgs('/api/v1/exact-match?query=dog', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: { names:[{ name:'any-name' }] } }))
        )
        store.dispatch('checkManualExactMatches', 'dog')

        setTimeout(()=>{
            expect(store.state.exactMatchesConflicts).toEqual([{ text:'any-name' }])
            done();
        }, 300)
    })

    it('encodes the query', (done)=>{
        sandbox.getStub = sandbox.stub(axios, 'get');
        sandbox.getStub.withArgs('/api/v1/exact-match?query=dog%26cat', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: { names:[{ name:'any-name' }] } }))
        )
        store.dispatch('checkManualExactMatches', 'dog&cat')

        setTimeout(()=>{
            expect(store.state.exactMatchesConflicts).toEqual([{ text:'any-name' }])
            done();
        }, 300)
    })

})
