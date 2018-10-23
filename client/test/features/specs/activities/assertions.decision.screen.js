let heSeesTheSelectedConditionInDecisionScreen = (then, data)=>{
    then(/^he sees the selected condition about (.*)/, (word) => {
        let item = data.vm.$el.querySelector('div.lower-section div.multiselect__content-wrapper .multiselect__option--highlight')
        expect(item.innerHTML).toContain(word)
    });
}

module.exports = {
    heSeesTheSelectedConditionInDecisionScreen:heSeesTheSelectedConditionInDecisionScreen
}
