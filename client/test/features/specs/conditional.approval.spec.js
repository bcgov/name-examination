import staticFilesServer from '../../unit/static.files.server';
import { createApiSandbox, sinon } from './support/api.stubs'
import {
    givenQueue,
    givenRestrictedWord
} from './support'
import {
    openNameExamination,
    accessConditionsTab,
    selectCondition,
    accessDecisionScreen,
    conditionalyApprove
} from './activities'
import {
    heSeesNrStatusIsApproved,
    heSeesTheSelectedConditionInDecisionScreen
} from './assertions'
import { loadFeature, defineFeature } from 'jest-cucumber';
const feature = loadFeature('./test/features/conditional.approval.feature');

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

    test('Joe can approve a request with a condition', ({ given, when, then }) => {

        givenRestrictedWord(given, data)

        givenQueue(given, data)

        openNameExamination(given, data)

        accessConditionsTab(given, data)

        selectCondition(given, data)

        accessDecisionScreen(when, data)

        heSeesTheSelectedConditionInDecisionScreen(then, data)

        conditionalyApprove(when, data)

        heSeesNrStatusIsApproved(then, data)
    })
})
