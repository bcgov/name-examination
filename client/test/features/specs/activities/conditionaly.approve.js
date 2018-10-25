import sinon from 'sinon'

let conditionalyApprove = (when, data)=>{
    when(/^he approves (.*)$/, (nr) => {
        return new Promise((done) => {
            data.apiSandbox.getStub.withArgs('/api/v1/requests/'+nr, sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names:[
                        { choice:1, state:'E', name:'Incredible name' }
                    ],
                    state: 'APPROVED',
                    requestTypeCd: 'CR',
                    applicants: '',
                    nwpta: [],
                    userId: data.owner
                } }))
            )
            let button = data.vm.$el.querySelector('#decision-approve-button');
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
    conditionalyApprove:conditionalyApprove
}
