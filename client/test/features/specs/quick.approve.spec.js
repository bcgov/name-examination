import staticFilesServer from '../../unit/static.files.server';
import { createApiSandbox, sinon } from './support/api.stubs'
import {
    givenSomeoneHasAssignedNr,
    whenSomeoneAccessNameExamination,
    whenHeQuicklyApproves,
    heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove,
    heSeesNrStatusIsApproved
} from './activities'
import { loadFeature, defineFeature } from 'jest-cucumber';
const feature = loadFeature('./test/features/quick.approve.feature');

defineFeature(feature, test => {

    let data = {};

    beforeEach((done) => {
        data.apiSandbox = createApiSandbox()
        jest.setTimeout(100000);
        staticFilesServer.start(done)
    })
    afterEach((done)=>{
        data.apiSandbox.restore()
        staticFilesServer.stop(done)
    })

    test('Joe can quickly approve the next examination assigned to him', ({ given, when, then }) => {

        givenSomeoneHasAssignedNr(given, data)

        whenSomeoneAccessNameExamination(given, data)

        heSeesThatHeCanQuicklyApprove(then, data)


        whenHeQuicklyApproves(when, data)

        heSeesNrStatusIsApproved(then, data)
    })

    test('Max can not quickly approve examination assigned to Joe', ({ given, when, then }) => {

        givenSomeoneHasAssignedNr(given, data)

        whenSomeoneAccessNameExamination(given, data)

        heSeesThatHeCanNotQuicklyApprove(then, data)

    })
})
