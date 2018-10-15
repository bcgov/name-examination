import { whenSomeoneAccessNameExamination } from './when.accessing.name.examination'
import { givenSomeoneHasAssignedNr } from './given.assigned.nr'
import {
    heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove
} from './assertions.quick.approve'
import { whenHeQuicklyApproves } from './quick.approval';
import { heSeesNrStatusIsApproved } from './assertions.nr.status'

module.exports = {
    givenSomeoneHasAssignedNr:givenSomeoneHasAssignedNr,
    whenSomeoneAccessNameExamination:whenSomeoneAccessNameExamination,
    heSeesThatHeCanQuicklyApprove:heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove:heSeesThatHeCanNotQuicklyApprove,
    whenHeQuicklyApproves:whenHeQuicklyApproves,
    heSeesNrStatusIsApproved:heSeesNrStatusIsApproved
}
