let heSeesTheSelectedConditionInDecisionScreen = (then, data)=>{
    then(/^he sees the selected condition about (.*)/, (word) => {
        let item = data.vm.$el.querySelector('div.lower-section div.namePage span div.row div div div.multiselect div.multiselect__tags-wrap')
        expect(item.innerHTML).toContain(word)
    });
}

let heSeesConditionListIsEmpty = (then, data)=>{
    then(/^he sees conditions list is empty/, () => {
        let item = data.vm.$el.querySelector('div.lower-section div.namePage span div.row div div div.multiselect div.multiselect__tags-wrap')
        expect(item.innerHTML).toEqual('')
    });
}

module.exports = {
    heSeesTheSelectedConditionInDecisionScreen:heSeesTheSelectedConditionInDecisionScreen,
    heSeesConditionListIsEmpty:heSeesConditionListIsEmpty
}
