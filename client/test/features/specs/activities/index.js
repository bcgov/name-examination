import { whenSomeoneAccessNameExamination } from './when.accessing.name.examination'
import { givenSomeoneHasAssignedNr } from './given.assigned.nr'
import {
    heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove
} from './assertions.quick.approve'
import { whenHeQuicklyApproves } from './quick.approval'
import { heSeesNrStatusIsApproved } from './assertions.nr.status'
import { whenSomeoneAccessConditionsTab } from './when.accessing.conditions.tab'
import { whenSomeoneSelectTheCondition } from './when.selecting.condition'
import { whenSomeoneGoesToDecisionScreen } from './when.going.to.decision.screen'
import { heSeesTheSelectedConditionInDecisionScreen, heSeesConditionListIsEmpty } from './assertions.decision.screen'
import { whenSomeoneApprovesWithCondition } from './when.approving.with.condition'
import { givenRestrictedWord } from './given.restricted.word'
import { whenGetNext } from './get.next'
import { givenQueue, givenQueueIsEmpty } from './given.queue'

module.exports = {
    givenSomeoneHasAssignedNr:givenSomeoneHasAssignedNr,
    whenSomeoneAccessNameExamination:whenSomeoneAccessNameExamination,
    heSeesThatHeCanQuicklyApprove:heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove:heSeesThatHeCanNotQuicklyApprove,
    whenHeQuicklyApproves:whenHeQuicklyApproves,
    heSeesNrStatusIsApproved:heSeesNrStatusIsApproved,
    whenSomeoneAccessConditionsTab:whenSomeoneAccessConditionsTab,
    whenSomeoneSelectTheCondition:whenSomeoneSelectTheCondition,
    whenSomeoneGoesToDecisionScreen:whenSomeoneGoesToDecisionScreen,
    heSeesTheSelectedConditionInDecisionScreen:heSeesTheSelectedConditionInDecisionScreen,
    whenSomeoneApprovesWithCondition:whenSomeoneApprovesWithCondition,
    givenRestrictedWord:givenRestrictedWord,
    whenGetNext:whenGetNext,
    heSeesConditionListIsEmpty:heSeesConditionListIsEmpty,
    givenQueue:givenQueue,
    givenQueueIsEmpty:givenQueueIsEmpty
}
