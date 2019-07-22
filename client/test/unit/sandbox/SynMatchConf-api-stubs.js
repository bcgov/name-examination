/*eslint-disable*/
import sinon from 'sinon';
import axios from '@/axios-auth.js';

module.exports = {
    createApiSandbox: () => {
        sinon.restore()
        let sandbox = sinon.createSandbox()
        sandbox.putStub = sandbox.stub(axios, 'put');
        sandbox.postStub = sandbox.stub(axios, 'post');
        sandbox.getStub = sandbox.stub(axios, 'get');
        sandbox.patchStub = sandbox.stub(axios, 'patch');

        sandbox.getStub.withArgs('/api/v1/requests/decisionreasons', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: [] }))
        )

        sandbox.postStub.withArgs('/api/v1/documents:trademarks', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
                names: []
            } }))
        )

        sandbox.getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
          new Promise((resolve) =>
            resolve({
              data: {
                nameRequest: 'NR1234'
              }
            })
          )
        )

        sandbox.getStub.withArgs('/api/v1/requests/NR1234', sinon.match.any).returns(
          new Promise((resolve) => {
            resolve({
              data: {
                names: [ { choice: 1, state: 'NE', name: 'hot boogie boards' } ],
                state: 'INPROGRESS',
                requestTypeCd: 'CR',
                applicants: '',
                nwpta: [],
                userId: 'Joe'
              }
            })
          })
        )

        sandbox.getStub.withArgs('/api/v1/exact-match?query=hot%20boogie%20boards', sinon.match.any).returns(
          new Promise((resolve) =>
            resolve({
              data: {
                names: [ { name: 'fake exact match' } ],
              }
            })
          )
        )


        sandbox.getStub.withArgs('/api/v1/requests/synonymbucket/hot boogie boards/*', sinon.match.any).returns(
          new Promise((resolve) =>
            resolve({
              data: {
                'highlighting': [],
                'names': [
                  {
                    'name_info': { 'name': '----HOT BOOGIE BOARDS - PROXIMITY SEARCH' },
                    'stems': [ 'HOT', 'BOOGI', 'BOARD' ]
                  },
                  {
                    'name_info': { 'name': '----HOT BOOGIE BOARDS* - EXACT WORD ORDER' },
                    'stems': [ 'HOT', 'BOOGI', 'BOARD' ]
                  },
                  {
                    'name_info': { 'name': '----HOT BOOGIE synonyms:(BOARD) - PROXIMITY SEARCH' },
                    'stems': [ 'HOT', 'BOOGI' ]
                  },
                  {
                    'name_info': { 'name': '----HOT BOOGIE* synonyms:(BOARD) - EXACT WORD ORDER' },
                    'stems': [ 'HOT', 'BOOGI' ]
                  },
                  { 'name_info': { 'name': '----HOT synonyms:(BOARD) - PROXIMITY SEARCH' }, 'stems': [ 'HOT' ] },
                  {
                    'name_info': {
                      'id': '0826947',
                      'jurisdiction': 'BC',
                      'name': 'HOT BIKES AND BOARDS LTD.',
                      'score': 6.488386,
                      'source': 'CORP',
                      'start_date': '2008-06-05T10:05:24Z',
                    }, 'stems': [ 'HOT', 'BOARD' ],
                  },
                  { 'name_info': { 'name': '----HOT* synonyms:(BOARD) - EXACT WORD ORDER' }, 'stems': [ 'HOT' ] } ],
                'response': { 'maxScore': 0.0, 'name': 'txt_starts_with:HOT*', 'numFound': 2 }
              }

            })
          )
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
        sandbox.getStub.withArgs('/api/v1/requests/cobrsphonetics/hot boogie boards/*', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
                names: []
            } }))
        )
        sandbox.getStub.withArgs('/api/v1/requests/phonetics/hot boogie boards/*', sinon.match.any).returns(
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
          new Promise((resolve) => {
            resolve({
              data: {
                names: [ { choice: 1, state: 'NE', name: 'hot boogie boards' } ],
                state: 'INPROGRESS',
                requestTypeCd: 'CR',
                applicants: '',
                nwpta: [],
                userId: 'Joe'
              }
            })
          })
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
