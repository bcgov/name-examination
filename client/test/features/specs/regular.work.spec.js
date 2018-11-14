import staticFilesServer from '../../unit/static.files.server';
import { createApiSandbox, sinon } from './support/api.stubs'
import {
    givenRestrictedWord,
    givenQueue
} from './support'
import {
    openNameExamination,
    accessConditionsTab,
    selectCondition,
    accessDecisionScreen,
    conditionalyApprove,
    getNext
} from './activities'
import {
    heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove,
    heSeesNrStatusIsApproved,
    heSeesTheSelectedConditionInDecisionScreen,
    heSeesConditionListIsEmpty
} from './assertions'
import { loadFeature, defineFeature } from 'jest-cucumber';
const feature = loadFeature('./test/features/regular.work.feature');

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

    test('Joe can chain approval of several requests', ({ given, when, then }) => {

        givenRestrictedWord(given, data)

        givenQueue(given, data)
        

        openNameExamination(given, data)

        accessConditionsTab(given, data)

        selectCondition(given, data)

        accessDecisionScreen(when, data)

        heSeesTheSelectedConditionInDecisionScreen(then, data)

        conditionalyApprove(when, data)

        heSeesNrStatusIsApproved(then, data)


        getNext(when, data)

        accessDecisionScreen(when, data)

        heSeesConditionListIsEmpty(then, data)

        conditionalyApprove(when, data)

        heSeesNrStatusIsApproved(then, data)
    })
})
