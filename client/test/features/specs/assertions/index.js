import {
    heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove
} from './quick.approve.availability'
import {
    heSeesNrStatusIsApproved
} from './nr.status.approved'
import {
    heSeesTheSelectedConditionInDecisionScreen,
    heSeesConditionListIsEmpty
} from './decision.screen.conditions'

module.exports = {
    heSeesThatHeCanQuicklyApprove:heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove:heSeesThatHeCanNotQuicklyApprove,
    heSeesNrStatusIsApproved:heSeesNrStatusIsApproved,
    heSeesTheSelectedConditionInDecisionScreen:heSeesTheSelectedConditionInDecisionScreen,
    heSeesConditionListIsEmpty:heSeesConditionListIsEmpty
}
