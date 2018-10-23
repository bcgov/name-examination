import sinon from 'sinon'

let givenSomeoneHasAssignedNrRequiringConsent = (given, data)=>{
    given(/^(.*) has an (.*) assigned name request (.*) with name (.*)$/, (user, state, nr, name) => {
        data.owner = user
        data.apiSandbox.getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: { nameRequest:nr } }))
        )
        data.apiSandbox.getStub.withArgs('/api/v1/requests/'+nr, sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
                names:[
                    { choice:1, state:'NE', name:name }
                ],
                state: state,
                requestTypeCd: 'CR',
                applicants: '',
                nwpta: [],
                userId: user
            } }))
        )
        data.apiSandbox.putStub.withArgs('/api/v1/requests/'+nr+'/names/1', sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
            } }))
        )
        data.apiSandbox.patchStub.withArgs('/api/v1/requests/'+nr, sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
            } }))
        )
    })
}

module.exports = {
    givenSomeoneHasAssignedNrRequiringConsent:givenSomeoneHasAssignedNrRequiringConsent
}
