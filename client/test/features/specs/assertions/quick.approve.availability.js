let heSeesThatHeCanQuicklyApprove = (then, data)=>{
    then(/^he sees that he can quickly approve (.*)$/, (nr)=>{
        expect(data.vm.$el.querySelector('#examine-quick-approve-button').textContent).toEqual('Quick Approve')
        expect(data.vm.$el.querySelector('#div1').textContent).toContain(nr)
        expect(data.vm.$el.querySelector('#div1').textContent).toContain('Status: INPROGRESS')
    })
}
let heSeesThatHeCanNotQuicklyApprove = (then, data)=>{
    then(/^he sees that he can NOT quickly approve (.*)$/, (nr)=>{
        expect(data.vm.$el.querySelector('#div1').textContent).toContain('Status:   ERROR!!')
        expect(data.vm.$el.querySelector('#examine-quick-approve-button')).toEqual(null)
    })
}

module.exports = {
    heSeesThatHeCanQuicklyApprove:heSeesThatHeCanQuicklyApprove,
    heSeesThatHeCanNotQuicklyApprove:heSeesThatHeCanNotQuicklyApprove
}
