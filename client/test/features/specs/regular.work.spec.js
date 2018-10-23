import staticFilesServer from '../../unit/static.files.server';
import { createApiSandbox, sinon } from './support/api.stubs'
import {
    givenSomeoneHasAssignedNr,
    whenSomeoneAccessNameExamination,
    whenSomeoneAccessConditionsTab,
    whenHeQuicklyApproves,
    heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove,
    heSeesNrStatusIsApproved,
    whenSomeoneSelectTheCondition,
    whenSomeoneGoesToDecisionScreen,
    heSeesTheSelectedConditionInDecisionScreen,
    whenSomeoneApprovesWithCondition,
    givenRestrictedWord,
    whenGetNext,
    heSeesConditionListIsEmpty
} from './activities'
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

        givenSomeoneHasAssignedNr(given, data)

        whenSomeoneAccessNameExamination(given, data)

        whenSomeoneAccessConditionsTab(given, data)

        whenSomeoneSelectTheCondition(given, data)

        whenSomeoneGoesToDecisionScreen(when, data)

        heSeesTheSelectedConditionInDecisionScreen(then, data)

        whenSomeoneApprovesWithCondition(when, data)

        heSeesNrStatusIsApproved(then, data)


        givenSomeoneHasAssignedNr(given, data)

        whenGetNext(when, data)

        whenSomeoneGoesToDecisionScreen(when, data)

        heSeesConditionListIsEmpty(then, data)

        whenSomeoneApprovesWithCondition(when, data)

        heSeesNrStatusIsApproved(then, data)
    })
})
