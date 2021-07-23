/*eslint-disable*/
let heSeesTheSelectedConditionInDecisionScreen = (then, data) => {
    then(/^he sees the selected condition about (.*)/, (word) => {
        let justPhrase = word.split(' ')[0]
        let item = data.vm.$el.querySelector('#conditions-decision-select-field')
        expect(item.textContent).toContain(justPhrase)
    });
}

let heSeesConditionListIsEmpty = (then, data) => {
    then(/^he sees conditions list is empty/, () => {
        let selection = data.vm.$el.querySelector('#conditions-select-area .v-menu__content')
        expect(selection).toBeNull()
    });
}

module.exports = {
    heSeesTheSelectedConditionInDecisionScreen:heSeesTheSelectedConditionInDecisionScreen,
    heSeesConditionListIsEmpty:heSeesConditionListIsEmpty
}
