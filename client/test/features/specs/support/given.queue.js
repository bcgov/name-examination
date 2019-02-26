import sinon from 'sinon'

let givenQueue = (given, data)=>{
    given(/^the name request queue contains:$/, (table) => {
        data.queue = table;
        data.queueIndex = 0;
        data.nr = function(index) {
            return data.queue[index].NR
        };
        data.name = function(index) {
            return data.queue[index].Name
        };
        data.stubApi = function(options) {
            data.apiSandbox.getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: { nameRequest:data.nr(data.queueIndex) } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/'+data.nr(data.queueIndex), sinon.match.any).returns(
                new Promise((resolve) => {
                    resolve({
                        data: {
                            names:[
                                { choice:1, state:'NE', name:data.name(data.queueIndex) }
                            ],
                            state: 'INPROGRESS',
                            requestTypeCd: 'CR',
                            applicants: '',
                            nwpta: [],
                            userId: options.user
                        }
                    })
                })
            )
            data.apiSandbox.getStub.withArgs('/api/v1/exact-match?query='+encodeURIComponent(data.name(data.queueIndex)), sinon.match.any).returns(
                new Promise((resolve) => {
                    resolve({
                        data: {
                            names:[
                                { choice:1, state:'NE', name:data.name(data.queueIndex) }
                            ],
                            state: 'INPROGRESS',
                            requestTypeCd: 'CR',
                            applicants: '',
                            nwpta: [],
                            userId: options.user
                        }
                    })
                })
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/synonymbucket/' + data.name(data.queueIndex).replace('&',' ') + '/*', sinon.match.any).returns(
                new Promise((resolve) => {
                    resolve({
                        data: {
                            names:[]
                        }
                    })
                })
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/cobrsphonetics/' + data.name(data.queueIndex).replace('&',' ') + '/*', sinon.match.any).returns(
                new Promise((resolve) => {
                    resolve({
                        data: {
                            names:[]
                        }
                    })
                })
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/phonetics/' + data.name(data.queueIndex).replace('&',' ') + '/*', sinon.match.any).returns(
                new Promise((resolve) => {
                    resolve({
                        data: {
                            names:[]
                        }
                    })
                })
            )
            data.queueIndex++;
        }
    })
}
let givenQueueIsEmpty = (given, data)=>{
    given(/^the name request queue is empty$/, () => {
        data.stubApi = function() {
            data.apiSandbox.getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: { } }))
            )
        }
    })
}

module.exports = {
    givenQueue:givenQueue,
    givenQueueIsEmpty:givenQueueIsEmpty
}
