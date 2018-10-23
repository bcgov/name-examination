import sinon from 'sinon'

let whenGetNext = (when, data)=>{
    when(/^(.*) accesses the next examination$/, (userId) => {
        if (userId == data.owner) {
            data.apiSandbox.getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: { nameRequest:data.request.nr } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/'+data.request.nr, sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names:[
                        { choice:1, state:'NE', name:data.request.name }
                    ],
                    state: data.request.state,
                    requestTypeCd: 'CR',
                    applicants: '',
                    nwpta: [],
                    userId: userId
                } }))
            )
        }
        else {
            data.apiSandbox.getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: { message:'No more NRs in Queue to process' } }))
            )
        }
        return new Promise((done) => {
            let button = data.vm.$el.querySelector('#examine-get-next-button');
            expect(button).not.toEqual(null)
            let window = button.ownerDocument.defaultView;
            var click = new window.Event('click');
            button.dispatchEvent(click);
            setTimeout(()=>{
                done();
            }, 1000)
        });
    });
}

module.exports = {
    whenGetNext:whenGetNext
}
