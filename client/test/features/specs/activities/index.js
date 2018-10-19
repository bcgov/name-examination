import { whenSomeoneAccessNameExamination } from './when.accessing.name.examination'
import { givenSomeoneHasAssignedNr } from './given.assigned.nr'
import {
    heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove
} from './assertions.quick.approve'
import { whenHeQuicklyApproves } from './quick.approval'
import { heSeesNrStatusIsApproved } from './assertions.nr.status'
import { givenSomeoneHasAssignedNrRequiringConsent } from './given.assigned.nr.requiring.consent'
import { whenSomeoneAccessConditionsTab } from './when.accessing.conditions.tab'
import { whenSomeoneSelectTheCondition } from './when.selecting.condition'
import { whenSomeoneGoesToDecisionScreen } from './when.going.to.decision.screen'
import { heSeesTheSelectedConditionInDecisionScreen } from './assertions.decision.screen'
import { whenSomeoneApprovesWithCondition } from './when.approving.with.condition'
import { givenRestrictedWord } from './given.restricted.word'

module.exports = {
    givenSomeoneHasAssignedNr:givenSomeoneHasAssignedNr,
    whenSomeoneAccessNameExamination:whenSomeoneAccessNameExamination,
    heSeesThatHeCanQuicklyApprove:heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove:heSeesThatHeCanNotQuicklyApprove,
    whenHeQuicklyApproves:whenHeQuicklyApproves,
    heSeesNrStatusIsApproved:heSeesNrStatusIsApproved,
    givenSomeoneHasAssignedNrRequiringConsent:givenSomeoneHasAssignedNrRequiringConsent,
    whenSomeoneAccessConditionsTab:whenSomeoneAccessConditionsTab,
    whenSomeoneSelectTheCondition:whenSomeoneSelectTheCondition,
    whenSomeoneGoesToDecisionScreen:whenSomeoneGoesToDecisionScreen,
    heSeesTheSelectedConditionInDecisionScreen:heSeesTheSelectedConditionInDecisionScreen,
    whenSomeoneApprovesWithCondition:whenSomeoneApprovesWithCondition,
    givenRestrictedWord:givenRestrictedWord
}
