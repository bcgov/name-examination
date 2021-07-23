let heSeesThatHeCanQuicklyApprove = (then, data) => {
    then(/^he sees that he can quickly approve (.*)$/, (nr) => {
        expect(data.vm.$el.querySelector('#examine-quick-approve-button')).not.toEqual(null)
        expect(data.vm.$el.querySelector('#nrNumberDisplay').textContent).toContain(nr)
        expect(data.vm.$el.querySelector('#nrStatusText').textContent).toMatch(/INPROGRESS/)
    })
}
let heSeesThatHeCanNotQuicklyApprove = (then, data) => {
    then(/^he sees that he can NOT quickly approve (.*)$/, (nr) => {
        expect(data.vm.$el.querySelector('#request-type-desc').textContent).toContain('ERROR!!')
        expect(data.vm.$el.querySelector('#examine-quick-approve-button')).toEqual(null)
    })
}

module.exports = {
    heSeesThatHeCanQuicklyApprove:heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove:heSeesThatHeCanNotQuicklyApprove
}
