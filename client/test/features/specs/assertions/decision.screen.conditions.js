let heSeesTheSelectedConditionInDecisionScreen = (then, data)=>{
    then(/^he sees the selected condition about (.*)/, (word) => {
        let item = data.vm.$el.querySelector('div.lower-section div.namePage span div.row div div div.multiselect div.multiselect__tags-wrap')
        expect(item.innerHTML).toContain(word)
    });
}

let heSeesConditionListIsEmpty = (then, data)=>{
    then(/^he sees conditions list is empty/, () => {
        let selection = data.vm.$el.querySelector('div.lower-section div.namePage span div.row div div div.multiselect div.multiselect__tags-wrap')
        expect(selection.innerHTML).toEqual('')
        let list = data.vm.$el.querySelector('div.lower-section div.namePage span div.row div div div.multiselect div.multiselect__content-wrapper li.multiselect__element .multiselect__option span')
        expect(list.innerHTML).toEqual('Consent Required')
    });
}

module.exports = {
    heSeesTheSelectedConditionInDecisionScreen:heSeesTheSelectedConditionInDecisionScreen,
    heSeesConditionListIsEmpty:heSeesConditionListIsEmpty
}
