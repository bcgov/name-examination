import sinon from 'sinon';
import axios from '@/axios-auth.js';

module.exports = {
    createApiSandbox:()=> {
        sinon.restore()
        let sandbox = sinon.createSandbox()
        sandbox.putStub = sandbox.stub(axios, 'put');
        sandbox.postStub = sandbox.stub(axios, 'post');
        sandbox.getStub = sandbox.stub(axios, 'get');
        sandbox.patchStub = sandbox.stub(axios, 'patch');
        sandbox.getStub.withArgs('/api/v1/requests/decisionreasons', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: [] }))
        )
        sandbox.postStub.withArgs('/api/v1/documents:conflicts', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
                setConflicts: {},
                names: [],
                response: {}
            } }))
        )
        sandbox.postStub.withArgs('/api/v1/documents:trademarks', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
                names: []
            } }))
        )
        sandbox.postStub.withArgs('/api/v1/documents:restricted_words', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
                restricted_words_conditions: []
            } }))
        )
        sandbox.postStub.withArgs('/api/v1/documents:histories', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
                names: []
            } }))
        )

        sandbox.getStub.withArgs('/api/v1/requests/undefined', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {} }))
        )
        sandbox.putStub.withArgs('/api/v1/requests/undefined/names/1', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {} }))
        )
        sandbox.patchStub.withArgs('/api/v1/requests/undefined', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {} }))
        )
        sandbox.getStub.withArgs('/api/v1/requests/null', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {} }))
        )
        sandbox.putStub.withArgs('/api/v1/requests/null/names/1', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {} }))
        )
        sandbox.patchStub.withArgs('/api/v1/requests/null', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {} }))
        )

        sandbox.putStub.withArgs(sinon.match(/\/api\/v1\/requests\/(.*)\/names\/1/), sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
            } }))
        )
        sandbox.patchStub.withArgs(sinon.match(/\/api\/v1\/requests\/(.*)/), sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
            } }))
        )

        return sandbox;
    },
    sinon:sinon
}
