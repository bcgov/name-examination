/*eslint-disable*/
import sinon from 'sinon'
import axios from '@/axios-auth.js'

module.exports = {
  createApiSandbox: () => {
    sinon.restore()
    let sandbox = sinon.createSandbox()
    sandbox.putStub = sandbox.stub(axios, 'put').returns(new Promise((resolve) => resolve({
      data: {
        names: [],
      }
    })))
    sandbox.postStub = sandbox.stub(axios, 'post').returns(new Promise((resolve) => resolve({
      data: {
        names: [],
      }
    })))
    sandbox.getStub = sandbox.stub(axios, 'get').returns(new Promise((resolve) => resolve({
      data: {
        names: [],
      }
    })))
    sandbox.patchStub = sandbox.stub(axios, 'patch').returns(new Promise((resolve) => resolve({
      data: {
        names: [],
      }
    })))

    return sandbox
  },
  sinon: sinon,
}
