let heSeesNrStatusIsApproved = (then, data)=>{
    then(/^he sees that (.*) is now (.*)/, (nr, state) => {
        expect(data.vm.$el.querySelector('#div1').textContent).toContain(nr)
        expect(data.vm.$el.querySelector('#div1').textContent).toContain('Status: APPROVED')
    });
}

module.exports = {
    heSeesNrStatusIsApproved:heSeesNrStatusIsApproved
}
