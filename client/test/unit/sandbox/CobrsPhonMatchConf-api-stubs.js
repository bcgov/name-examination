/*eslint-disable*/
import sinon from 'sinon'
import axios from '@/axios-auth.js'

module.exports = {
  createApiSandbox: () => {
    sinon.restore()
    let sandbox = sinon.createSandbox()
    sandbox.putStub = sandbox.stub(axios, 'put')
    sandbox.postStub = sandbox.stub(axios, 'post')
    sandbox.getStub = sandbox.stub(axios, 'get')
    sandbox.patchStub = sandbox.stub(axios, 'patch')

    sandbox.getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
      new Promise((resolve) => resolve({ data: { nameRequest: 'NR1234' } }))
    )

    sandbox.getStub.withArgs('/api/v1/requests/NR1234', sinon.match.any).returns(
      new Promise((resolve) => {
        resolve({
          data: {
            names: [ { choice: 1, state: 'NE', name: 'incredible name inc' } ],
            state: 'INPROGRESS',
            requestTypeCd: 'CR',
            applicants: '',
            nwpta: [],
            userId: 'Joe',
          }
        })
      })
    )

    sandbox.getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc/*', sinon.match.any).returns(
      new Promise((resolve) => {
        resolve({
          data: {
            names: [
              { name_info: { name: '----INCREDIBLE NAME INC - meta1' }, stems: [] },
              { name_info: { name: '----INCREDIBLE NAME - meta2' }, stems: [] },
              { name_info: { name: '----INCREDIBLE - meta3' }, stems: [] },
              {
                name_info: {
                  id: '0693638',
                  name: 'INCREDIBLE STEPS RECORDS, INC.',
                  score: 1.0,
                  jurisdiction: 'BC',
                  start_date: '1986-10-26',
                  source: 'CORP',
                },
                stems: [],
              }
            ]
          }
        })
      })
    )

    sandbox.getStub.withArgs('/api/v1/requests/phonetics/incredible name inc/*', sinon.match.any).returns(
      new Promise((resolve) => {
        resolve({
          data: {
            names: [
              { name_info: { name: '----INCREDIBLE NAME INC - meta1' }, stems: [], },
              { name_info: { name: '----INCREDIBLE NAME - meta2' }, stems: [], },
              { name_info: { name: '----INCREDIBLE - meta3' }, stems: [] },
              {
                name_info: {
                  id: '0693638',
                  name: 'INCREDIBLE STEPS RECORDS, INC.',
                  score: 1.0,
                  jurisdiction: 'BC',
                  start_date: '1986-10-26',
                  source: 'CORP',
                },
                stems: [],
              }
            ]
          }
        })
      })
    )

    sandbox.getStub.withArgs('/api/v1/requests/cobrsphonetics/incredible name inc/*', sinon.match.any).returns(
      new Promise((resolve) => {
        resolve({
          data: {
            names: [
              { name_info: { name: '----INCREDIBLE NAME INC' }, stems: [] },
              { name_info: { name: '----INCREDIBLE NAME' }, stems: [] },
              { name_info: { name: '----INCREDIBLE' }, stems: [] },
              {
                name_info: {
                  id: '0793638',
                  name: 'INCREDYBLE STEPS RECORDS, INC.',
                  score: 1.0,
                  source: 'CORP',
                  jurisdiction: 'BC',
                  start_date: '1986-10-26',
                },
                stems: [],
              }
            ]
          }
        })
      })
    )

    sandbox.getStub.withArgs('/api/v1/requests/decisionreasons', sinon.match.any).returns(
      new Promise((resolve) => resolve({ data: [] })),
    )

    sandbox.postStub.withArgs('/api/v1/documents:trademarks', sinon.match.any).returns(
      new Promise((resolve) =>
        resolve({
          data: {
            names: [],
          }
        })
      )
    )

    sandbox.getStub.withArgs('/api/v1/exact-match?query=incredible%20name%20inc', sinon.match.any).returns(
      new Promise((resolve) =>
        resolve({
          data: {
            names: [ { name: 'fake exact match' } ],
          }
        })
      )
    )

    sandbox.postStub.withArgs('/api/v1/documents:restricted_words', sinon.match.any).returns(
      new Promise((resolve) =>
        resolve({
          data: {
            restricted_words_conditions: [],
          }
        })
      )
    )

    sandbox.postStub.withArgs('/api/v1/documents:histories', sinon.match.any).returns(
      new Promise((resolve) =>
        resolve({
          data: {
            names: [],
          }
        })
      )
    )

    sandbox.getStub.withArgs('/api/v1/requests/undefined', sinon.match.any).returns(
      new Promise((resolve) => resolve({ data: {} })),
    )

    sandbox.putStub.withArgs('/api/v1/requests/undefined/names/1', sinon.match.any).returns(
      new Promise((resolve) => resolve({ data: {} })),
    )

    sandbox.patchStub.withArgs('/api/v1/requests/undefined', sinon.match.any).returns(
      new Promise((resolve) => resolve({ data: {} })),
    )

    sandbox.getStub.withArgs('/api/v1/requests/null', sinon.match.any).returns(
      new Promise((resolve) => {
        resolve({
          data: {
            names: [ { choice: 1, state: 'NE', name: 'incredible name inc' } ],
            state: 'INPROGRESS',
            requestTypeCd: 'CR',
            applicants: '',
            nwpta: [],
            userId: 'Joe',
          }
        })
      })
    )

    sandbox.putStub.withArgs('/api/v1/requests/null/names/1', sinon.match.any).returns(
      new Promise((resolve) => resolve({ data: {} })),
    )

    sandbox.patchStub.withArgs('/api/v1/requests/null', sinon.match.any).returns(
      new Promise((resolve) => resolve({ data: {} })),
    )

    sandbox.putStub.withArgs(sinon.match(/\/api\/v1\/requests\/(.*)\/names\/1/), sinon.match.any).returns(
      new Promise((resolve) =>
        resolve({
          data: {}
        })
      )
    )

    sandbox.patchStub.withArgs(sinon.match(/\/api\/v1\/requests\/(.*)/), sinon.match.any).returns(
      new Promise((resolve) =>
        resolve({
          data: {}
        })
      ),
    )

    return sandbox
  },
  sinon: sinon,
}
