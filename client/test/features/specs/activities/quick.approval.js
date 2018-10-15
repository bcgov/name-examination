import sinon from 'sinon'

let whenHeQuicklyApproves = (when, data)=> {
    when(/^he quickly approves (.*)/, (nr) => {
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
            let button = data.vm.$el.querySelector('#examine-quick-approve-button');
            let window = button.ownerDocument.defaultView;
            var click = new window.Event('click');
            button.dispatchEvent(click);
            setTimeout(()=>{
                done();
            }, 1000)
        })
    });
}

module.exports = {
    whenHeQuicklyApproves:whenHeQuicklyApproves
}
