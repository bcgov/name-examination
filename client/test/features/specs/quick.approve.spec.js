import staticFilesServer from '../../unit/static.files.server';
import { createApiSandbox, sinon } from './support/api.stubs'
import {
    givenQueue,
    givenQueueIsEmpty
} from './support'
import {
    openNameExamination,
    quicklyApprove
} from './activities'
import {
    heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove,
    heSeesNrStatusIsApproved
} from './assertions'
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

        givenQueue(given, data)

        openNameExamination(given, data)

        heSeesThatHeCanQuicklyApprove(then, data)


        quicklyApprove(when, data)

        heSeesNrStatusIsApproved(then, data)
    })

    test('Max can not quickly approve examination assigned to Joe', ({ given, when, then }) => {

        givenQueueIsEmpty(given, data)

        openNameExamination(given, data)

        heSeesThatHeCanNotQuicklyApprove(then, data)

    })
})
